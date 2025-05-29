debugger;

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
        from: storage.from,
        to: storage.to,
        apikeys: storage.apikeys,
        models: storage.models,
        apitype: storage.apitype,
  }
  chrome.tabs.sendMessage(tab.id, msg);
});


