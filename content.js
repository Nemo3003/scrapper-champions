function obtenerReconocimientos() {
  const reconocimientos = [];
  const elementos = document.querySelectorAll('ul.feed-reconocimientos > li');

  elementos.forEach(el => {
    const fecha = el.querySelector('small.date')?.innerText.trim() || '';
    const autor = el.querySelector('h5')?.innerText.trim() || '';
    const categoria = el.querySelector('.m2.text-center.color3')?.innerText.trim() || '';
    const mensaje = el.querySelector('div.mensaje')?.innerText.trim() || '';

    reconocimientos.push({ fecha, autor, categoria, mensaje });
  });

  return reconocimientos;
}

async function enviarASlack(data) {
  const webhookURL = 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXX'; // Reemplaza con tu webhook de Slack

  // Formatear los datos como un mensaje de Slack
  const mensaje = data.map(row => 
    `*Fecha:* ${row.fecha}\n*Autor:* ${row.autor}\n*Categoría:* ${row.categoria}\n*Mensaje:* ${row.mensaje}`
  ).join('\n\n');

  const payload = {
    text: `Reconocimientos:\n\n${mensaje}`
  };

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('Datos enviados a Slack correctamente.');
    } else {
      console.error('Error al enviar datos a Slack:', response.statusText);
    }
  } catch (error) {
    console.error('Error al enviar datos a Slack:', error);
  }
}

// Listener para mensajes desde el popup o background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportCSV') {
    const datos = obtenerReconocimientos();
    if (datos.length > 0) {
      enviarASlack(datos);
      sendResponse({ success: true, message: 'Datos enviados a Slack correctamente.' });
    } else {
      sendResponse({ success: false, message: 'No se encontraron reconocimientos.' });
    }
  }
});