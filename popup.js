document.getElementById('scrape').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }, () => {
    chrome.tabs.sendMessage(tab.id, { action: 'exportCSV' }, (response) => {
      if (response?.success) {
        console.log(response.message);
      } else {
        console.error(response?.message || 'Error al exportar el CSV.');
      }
    });
  });
});