const API_URL = 'http://localhost:5000/check_url';

// Monitora as mudanças de abas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    checkURLSecurity(tab.url, tabId);
  }
});

// Função principal para verificar URL
async function checkURLSecurity(url, tabId) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });

    const result = await response.json();
    
    // Armazena resultado para o popup
    await chrome.storage.local.set({ [url]: result });
    
    // Envia alerta se for phishing
    if (result.status === 'ALERTA') {
      chrome.tabs.sendMessage(tabId, {
        action: 'phishingAlert',
        data: result
      });
    }

  } catch (error) {
    console.error('Erro ao verificar URL:', error);
    await chrome.storage.local.set({ 
      [url]: {
        status: 'ERROR',
        message: 'Falha na verificação'
      }
    });
  }
}

// Para verificação manual do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manualCheck') {
    checkURLSecurity(request.url, sender.tab.id)
      .then(() => sendResponse({success: true}))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true;
  }
  
  if (request.action === 'checkCurrentPage') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].url.startsWith('http')) {
        checkURLSecurity(tabs[0].url, tabs[0].id);
      }
    });
  }
});