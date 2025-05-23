chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "翻譯選取文字",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const settings = await chrome.storage.local.get(["from", "to", "apikey", "model"]);
  const from = settings.from || "English";
  const to = settings.to || "Japanese";
  const apikey = settings.apikey;
  const model = settings.model || "google/gemini-2.5-flash-preview";
  chrome.tabs.sendMessage(tab.id, { from: from, to: to, apikey: apikey, model: model});
});


