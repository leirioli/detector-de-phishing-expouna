document.addEventListener('DOMContentLoaded', function() {
  const statusSeguro = document.getElementById('status-seguro');
  const statusPerigoso = document.getElementById('status-perigoso');
  const popupTitulo = document.getElementById('popup-titulo');
  const popupMensagem = document.getElementById('popup-mensagem');
  const popupTituloPerigo = document.getElementById('popup-titulo-perigo');
  const popupMensagemPerigo = document.getElementById('popup-mensagem-perigo');

  // Verifica o status da página atual
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    const tab = tabs[0];
    
    if (tab.url && tab.url.startsWith('http')) {
      await updatePopupStatus(tab.url);
    } else {
      showNeutralStatus();
    }
  });

  async function updatePopupStatus(url) {
    try {
      // Busca resultado armazenado
      const stored = await chrome.storage.local.get([url]);
      
      if (stored[url]) {
        displayResult(stored[url]);
      } else {
        // Se não tem resultado, faz verificação
        showCheckingStatus();
        await checkURLManually(url);
      }
    } catch (error) {
      showErrorStatus();
    }
  }

  async function checkURLManually(url) {
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'manualCheck',
        url: url
      }, resolve);
    });

    if (response.success) {
      // Aguarda um pouco e busca o resultado atualizado
      setTimeout(async () => {
        const stored = await chrome.storage.local.get([url]);
        if (stored[url]) {
          displayResult(stored[url]);
        }
      }, 800);
    } else {
      showErrorStatus();
    }
  }

  function displayResult(result) {
    if (result.status === 'ALERTA') {
      // Mostra status perigoso
      statusSeguro.classList.add('hidden');
      statusPerigoso.classList.remove('hidden');
      
      popupTituloPerigo.textContent = 'Risco de Phishing Detectado!';
      popupMensagemPerigo.textContent = result.reason || result.mesoon || 'Este site apresenta características suspeitas.';
      
      // Adiciona informações adicionais
      const scoreInfo = document.createElement('div');
      scoreInfo.style.marginTop = '10px';
      scoreInfo.style.padding = '8px';
      scoreInfo.style.background = '#ffebee';
      scoreInfo.style.borderRadius = '4px';
      scoreInfo.style.fontSize = '12px';
      scoreInfo.innerHTML = `<strong>Score:</strong> ${result.score}`;
      
      if (!document.getElementById('score-info')) {
        scoreInfo.id = 'score-info';
        statusPerigoso.appendChild(scoreInfo);
      }
      
    } else if (result.status === 'OK') {
      // Mostra status seguro
      statusSeguro.classList.remove('hidden');
      statusPerigoso.classList.add('hidden');
      
      popupTitulo.textContent = 'Site Seguro';
      popupMensagem.textContent = result.reason || result.mesoon || 'Este site parece ser legítimo e confiável.';
      
      // Adiciona score se disponível
      if (result.score) {
        const scoreInfo = document.createElement('div');
        scoreInfo.style.marginTop = '10px';
        scoreInfo.style.padding = '8px';
        scoreInfo.style.background = '#e8f5e8';
        scoreInfo.style.borderRadius = '4px';
        scoreInfo.style.fontSize = '12px';
        scoreInfo.innerHTML = `<strong>Score de Segurança:</strong> ${result.score}`;
        
        if (!document.getElementById('score-info-seguro')) {
          scoreInfo.id = 'score-info-seguro';
          statusSeguro.appendChild(scoreInfo);
        }
      }
    } else {
      showErrorStatus();
    }
  }

  function showCheckingStatus() {
    statusSeguro.classList.remove('hidden');
    statusPerigoso.classList.add('hidden');
    popupTitulo.textContent = 'Verificando...';
    popupMensagem.textContent = 'Analisando a segurança deste site';
  }

  function showNeutralStatus() {
    statusSeguro.classList.remove('hidden');
    statusPerigoso.classList.add('hidden');
    popupTitulo.textContent = 'Detector de Phishing';
    popupMensagem.textContent = 'Navegue para um site para verificar sua segurança';
  }

  function showErrorStatus() {
    statusSeguro.classList.remove('hidden');
    statusPerigoso.classList.add('hidden');
    popupTitulo.textContent = 'Erro na Verificação';
    popupMensagem.textContent = 'Não foi possível verificar este site';
  }
});