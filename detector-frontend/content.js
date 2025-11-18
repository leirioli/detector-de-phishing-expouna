console.log("Content script carregado!");

// Escuta mensagens do background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script recebeu mensagem:", request);
  
  if (request.action === 'phishingAlert') {
    const status = request.data.status;
    
    const existingAlert = document.getElementById('alerta-overlay');
    if (existingAlert) {
        existingAlert.remove();
    }
    const existingSafeNotif = document.getElementById('safe-notification');
    if (existingSafeNotif) {
        existingSafeNotif.remove();
    }
    
    if (status === 'ALERTA') {
        console.log("Exibindo alerta de phishing (Overlay)!");
        displayPhishingAlert(request.data); // Cria o grande overlay (Risco)
    } else if (status === 'OK') {
        console.log("Exibindo notificação de site seguro (Canto)!");
        displaySafeNotification(request.data); // Cria a notificação pequena (Seguro)
    }
  }
});

function displaySafeNotification(alertData) {
    const notification = document.createElement('div');
    notification.id = 'safe-notification';
    notification.className = 'safe-corner-notification';
    
    const title = alertData.display_title || 'Site Seguro';
    const message = alertData.reason || 'Nenhuma ameaça de phishing detectada.';
    const score = alertData.score || 'N/A';
    
    notification.innerHTML = `
        <button class="btn-close" id="btn-close-safe">✕</button>
        <div class="icone-status icone-seguro">✅</div>
        <h2>${title}</h2>
        <p>${message}</p>
        <div style="font-size: 10px; margin-top: 5px; color: #777;">Score: ${score}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Adiciona listener para o botão de fechar
    notification.querySelector('#btn-close-safe').addEventListener('click', () => {
        notification.remove();
    });
    
    // Remove automaticamente após 8 segundos 
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 8000); 
}


function displayPhishingAlert(alertData) {
  if (alertData.status !== 'ALERTA') {
      return; 
  }
  
  console.log("Criando ALERTA de phishing com dados:", alertData);
  
  // Remove alerta existente 
  const existingAlert = document.getElementById('alerta-overlay');
  if (existingAlert) {
    existingAlert.remove();
  }

  const icon = '⚠️';
  const boxClass = 'caixinha-alerta';
  const titleColor = '#954535'; 
  const title = alertData.display_title || 'Alerta de Risco!';
  const message = alertData.reason || 'O site é suspeito de Phishing.';
  
  // Cria o overlay do alerta
  const alertOverlay = document.createElement('div');
  alertOverlay.id = 'alerta-overlay';
  alertOverlay.className = 'overlay';
  
  alertOverlay.innerHTML = `
    <div class="${boxClass}" style="max-width: 500px; background-color: rgb(54, 69, 79); padding: 50px; border-radius: 30px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); text-align: center; color: white;">
      <div class="perigo-icon" style="color: ${titleColor};">${icon}</div>
      <h1 id="titulo-alerta" style="color: ${titleColor};">${title}</h1>
      <p id="mensagem-alerta">${message}</p>
      <div class="score-info" style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
        <strong>Score de Segurança:</strong> ${alertData.score || 'N/A'}
      </div>
      <div class="btn-container">
        <button id="btn-voltar" class="btn btn-seguro">Sair do Site</button>
        <button id="btn-ignorar" class="btn btn-risco">
          Ignorar e continuar
        </button>
      </div>
    </div>
  `; 

  // Adiciona à página
  document.body.appendChild(alertOverlay);
  console.log("Alerta de Risco adicionado à página!");

  // Event listeners para os botões 
  alertOverlay.querySelector('#btn-voltar').addEventListener('click', () => {
    window.history.back();
    alertOverlay.remove();
  });

  alertOverlay.querySelector('#btn-ignorar').addEventListener('click', () => {
    alertOverlay.remove();
  });
}

// Teste inicial
console.log("Content script pronto para receber alertas!");