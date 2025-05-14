chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendToSlack') {
    const webhookURL = 'https://hooks.slack.com/'; 

    const mensaje = message.data.map(row =>
      `*Fecha:* ${row.fecha}\n*Autor:* ${row.autor}\n*Categoría:* ${row.categoria}\n*Mensaje:* ${row.mensaje}`
    ).join('\n\n');

    const payload = {
      text: `Reconocimientos:\n\n${mensaje}`
    };

    fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (response.ok) {
          console.log('Datos enviados a Slack correctamente.');
          sendResponse({ success: true });
        } else {
          console.error('Error al enviar datos a Slack:', response.statusText);
          sendResponse({ success: false, message: response.statusText });
        }
      })
      .catch(error => {
        console.error('Error al enviar datos a Slack:', error);
        sendResponse({ success: false, message: error.message });
      });

    return true; // Indica que la respuesta será enviada de forma asíncrona
  }
});