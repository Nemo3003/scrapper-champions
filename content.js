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

// Listener para mensajes desde el popup o background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportCSV') {
    const datos = obtenerReconocimientos();
    if (datos.length > 0) {
      // Enviar los datos al background script
      chrome.runtime.sendMessage({ action: 'sendToSlack', data: datos }, (response) => {
        if (response?.success) {
          sendResponse({ success: true, message: 'Datos enviados a Slack correctamente.' });
        } else {
          sendResponse({ success: false, message: response?.message || 'Error al enviar datos a Slack.' });
        }
      });
    } else {
      sendResponse({ success: false, message: 'No se encontraron reconocimientos.' });
    }
    return true; // Indica que la respuesta será enviada de forma asíncrona
  }
});