const from = document.getElementById("from");
const to = document.getElementById("to");
const apikey = document.getElementById("apikey");
const model = document.getElementById("model");
const saveBtn = document.getElementById("saveBtn");

chrome.storage.local.get(["from", "to", "apikey", "model"], (data) => {
    from.value = data.from || "English";
    to.value = data.to || "Japanese";
    apikey.value = data.apikey || "";
    model.value = data.model || "google/gemini-2.5-flash-preview"
});

saveBtn.onclick = () => {
    chrome.storage.local.set({
    from: from.value,
    to: to.value,
    apikey: apikey.value,
    model: model.value
    }, () => {
    saveBtn.textContent = '已儲存設定✅'
    });
};