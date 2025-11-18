const API_URL = 'http://127.0.0.1:5000/check_url';

// Monitora mudanças de abas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    console.log('Verificando URL:', tab.url);
    checkURLSecurity(tab.url, tabId);
  }
});

// Função para verificar URL
async function checkURLSecurity(url, tabId) {
  try {
    console.log('Enviando para API:', url);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('Resposta da API:', result);
    
    // Armazena resultado
    await chrome.storage.local.set({ [url]: result });
    
    chrome.tabs.sendMessage(tabId, {
      action: 'phishingAlert',
      data: result
    });

  } catch (error) {
    console.error('Erro ao verificar URL:', error);
  }
}

// Recebe mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Verifica se é a ação correta
    if (request.action === 'manualCheck') {
        // Verifica se 'sender.tab' e 'sender.tab.id' existem
        if (sender.tab && sender.tab.id) {
            checkURLSecurity(request.url, sender.tab.id)
                .then(() => sendResponse({success: true}))
                .catch(error => sendResponse({success: false, error: error.message}));
            return true;
            
        } else {
            // Se a mensagem vier de uma fonte sem aba, retorne um erro para quem chamou
            console.error("Tentativa de 'manualCheck' sem ID de aba válido.");
            sendResponse({success: false, error: "ID de aba ausente ou contexto do remetente inválido. Não é possível exibir o pop-up."});
        }
    }
});