chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "exportToCSV") {
    console.log("Mensaje recibido: exportToCSV");
    sendResponse({ success: true });
  }
});
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});