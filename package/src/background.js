chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "翻譯選取文字",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const storage = await chrome.storage.local.get(["from", "to", "apikeys", "models", "apitype"])
  let msg = {
        from: storage.from || defaults.from,
        to: storage.to || defaults.to,
        apikeys: storage.apikeys || defaults.apikeys,
        models: storage.models || defaults.models,
        apitype: storage.apitype || defaults.apitype
  }
  chrome.tabs.sendMessage(tab.id, msg);
});


