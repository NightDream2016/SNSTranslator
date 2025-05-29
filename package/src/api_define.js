const apiDefine = {
    google: {
        name: "Google Gemini",
        models: [
            { id:　"gemini-2.5-flash-preview-05-20", name: "Gemini 2.5 Flash" },
            { id: "gemini-2.5-pro-preview-05-06", name: "Gemini 2.5 Pro" }
        ]
    },
    openrouter: {
        name: "OpenRouter",
        models:[
            { id:"google/gemini-2.5-flash-preview", name: "Gemini 2.5 Flash (較快但無思考)" },
            { id:"google/gemini-2.5-flash-preview:thinking", name: "Gemini 2.5 Flash Exprimental(較慢但有思考)" },
            { id:"x-ai/grok-3-beta", name: "Grok 3(速度均衡)" },
            { id:"openai/gpt-4o", name: "ChatGPT-4o(速度均衡，但有NSFW限制)" },
            { id:"google/gemini-2.5-pro-preview", name: "Gemini 2.5 Pro Preview (速度較慢)" },
        ]
    } 
}
const defaultApi = apiDefine.google
const defaults = {
    apikeys: Object.fromEntries(Object.keys(apiDefine).map(key => [key, ""])),
    from: "English",
    to: "Japanese",
    apitype: defaultApi.id,
    models: Object.fromEntries(Object.keys(apiDefine).map(key => [key, apiDefine[key].models[0].id])),
} 