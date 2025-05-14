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

function exportarCSV(data) {
  const encabezados = ['Fecha', 'Autor', 'Categoría', 'Mensaje'];
  const filas = data.map(row => [
    `"${row.fecha}"`,
    `"${row.autor}"`,
    `"${row.categoria}"`,
    `"${row.mensaje.replace(/"/g, '""')}"`
  ]);

  const csvContent = [encabezados, ...filas].map(e => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');

  const fileName = `reconocimientos_${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Listener para mensajes desde el popup o background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportCSV') {
    const datos = obtenerReconocimientos();
    if (datos.length > 0) {
      exportarCSV(datos);
      sendResponse({ success: true, message: 'CSV exportado correctamente.' });
    } else {
      sendResponse({ success: false, message: 'No se encontraron reconocimientos.' });
    }
  }
});