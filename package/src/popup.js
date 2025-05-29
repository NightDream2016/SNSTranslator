debugger;
const from = document.getElementById("from");
const to = document.getElementById("to");
const apitype = document.getElementById("apitype");
const apiKeyLabel = document.getElementById("apiKeyLabel");
const apikey = document.getElementById("apikey");
const model = document.getElementById("model");
const saveBtn = document.getElementById("saveBtn");

let data = {}

from.onchange = () => {
    data.from = from.value;
};

to.onchange = () => {
    data.to = to.value;
}

apitype.onchange = () => {
    data.apitype = apitype.value;
    updateApiKey();
    updateModelOptions();
};

apikey.onchange = () => {
    data.apikeys[data.apitype] = apikey.value;
}

model.onchange = () => {
    data.models[apitype.value] = model.value;
};

saveBtn.onclick = () => {
    data.from = from.value;
    data.to = to.value;
    data.models[apitype.value] = model.value;
    data.apitype = apitype.value;
    data.apikeys[apitype.value] = apikey.value;
    chrome.storage.local.set({
        from: data.from,
        to: data.to,
        apikeys: data.apikeys,
        models: data.models,
        apitype: data.apitype
    }, () => {
        saveBtn.textContent = '已儲存設定✅'
    });
};

setup();

async function setup() {
    await loadDataFromStorage();
    from.value = data.from 
    to.value = data.to
    updateApiList();
    updateApiKey();
    updateModelOptions();
}

async function loadDataFromStorage() {
    const storage = await chrome.storage.local.get(["from", "to", "apikeys", "models", "apitype"])
    data = {
        from: storage.from || defaults.from,
        to: storage.to || defaults.to,
        apikeys: storage.apikeys || defaults.apikeys,
        models: storage.models || defaults.models,
        apitype: storage.apitype || defaults.apitype
    }
}

function updateApiList() {
    let innerHTML = "";
    Object.keys(apiDefine).forEach(key => {
        innerHTML += `<option value="${key}">${apiDefine[key].name}</option>`;
    });
    apitype.innerHTML = innerHTML;
    apitype.value = data.apitype;
}

function updateApiKey() {
    const name = apiDefine[data.apitype].name;
    apiKeyLabel.textContent = `${name} API Key`;
    apikey.value = data.apikeys[data.apitype] || "";
}

function updateModelOptions() {
    const apitype = data.apitype;
    let innerHTML = "";
    apiDefine[apitype].models.forEach(element => {
        innerHTML += `<option value="${element.id}">${element.name}</option>`;
    });
    model.innerHTML = innerHTML;
    model.value = data.models[apitype]
}