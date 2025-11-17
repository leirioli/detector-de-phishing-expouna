// Para escutar mensagens do background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'phishingAlert') {
    displayPhishingAlert(request.data);
  }
});

// Função para exibir o alerta de phishing 
function displayPhishingAlert(alertData) {
  // Para remove o alerta, se tiver
  const existingAlert = document.getElementById('alerta-overlay');
  if (existingAlert) {
    existingAlert.remove();
  }

  // Cria o overlay do alerta
  const alertOverlay = document.createElement('div');
  alertOverlay.id = 'alerta-overlay';
  alertOverlay.className = 'overlay';
  
  alertOverlay.innerHTML = `
    <div class="caixinha-alerta">
      <div class="perigo-icon">▲</div>
      <h1 id="titulo-alerta">Site suspeito detectado!</h1>
      <p id="mensagem-alerta">
        ${alertData.reason || alertData.mesoon || 'Cuidado! O sistema detectou que este site pode ser uma tentativa de Phishing. Seus dados podem estar em risco!'}
      </p>
      <div class="score-info" style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
        <strong>Score de Risco:</strong> ${alertData.score}
        ${alertData.site_minimo ? `<br><strong>Site Legítimo Similar:</strong> ${alertData.site_minimo}` : ''}
      </div>
      <div class="btn-container">
        <button id="btn-voltar" class="btn btn-seguro">Sair do Site</button>
        <button id="btn-ignorar" class="btn btn-risco">
          Ignorar e continuar (Não recomendado!)
        </button>
      </div>
    </div>
  `;

  // Adiciona à página
  document.body.appendChild(alertOverlay);

  // Event listeners para os botões
  alertOverlay.querySelector('#btn-voltar').addEventListener('click', () => {
    // Volta para a página anterior ou página segura
    window.history.back();
    alertOverlay.remove();
  });

  alertOverlay.querySelector('#btn-ignorar').addEventListener('click', () => {
    alertOverlay.remove();
  });

  // Fecha o alerta, clicando fora da caixa
  alertOverlay.addEventListener('click', (e) => {
    if (e.target === alertOverlay) {
      alertOverlay.remove();
    }
  });
}

// Verifica a página quando carrega
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', requestPageCheck);
} else {
  requestPageCheck();
}

function requestPageCheck() {
  // Solicita a verificação da página atual
  chrome.runtime.sendMessage({
    action: 'checkCurrentPage'
  });
}