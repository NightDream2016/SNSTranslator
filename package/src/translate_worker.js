class TranslateWorker {

    maxTryCount = 3 // 每個Request的Retry次數

    constructor(apikeys, apitype, models) {
        this.apikeys = apikeys
        this.apitype = apitype
        this.models = models
    }

    async tryTranslation(targetLang, inputTexts) {
        let error = null
        let results = []
        let tryCount = 0
        while (tryCount < this.maxTryCount) {
            try {
                const newTexts = await this.translationRequest(targetLang, inputTexts);
                results = results.concat(newTexts)
                error = null
                break
            } catch (e) {
                error = e
                console.log(`Translation failed with error: ${e}`)
                tryCount += 1
            }
        }
        if (error != null) {
            throw error
        }
        return results
    }

    async translationRequest(targetLang, inputTexts) {
        const apitype = this.apitype
        const apikey = this.apikeys[apitype]
        if (!apikey || apikey === "") {
            throw new Error("請輸入你的APIKey。")
        }
        let parsed = null
        if (apitype === "google") {
            parsed = await this.geminiRequest(targetLang, inputTexts);
        } else {
            parsed = await this.openaiRequest(targetLang, inputTexts);
        }

        // 驗證轉出長度與順序
        const results = []
        for (let i = 0; i < inputTexts.length; i++) {
            const key = `translation${i + 1}`
            if (!(key in parsed)) {
                throw new Error(`Missing key: ${key}`)
            }
            results.push(parsed[key])
        }

        return results
    }

    async geminiRequest(targetLang, inputTexts) {
        
        const model = this.models[this.apitype]
        const apikey = this.apikeys[this.apitype]

        let properties = {}
        for (let i = 0; i < inputTexts.length; i++) {
            properties[`translation${i + 1}`] = {
                type: "string",
                description: `Translation of inputTexts[${i}] in ${targetLang}.`
            }
        }

        const tools = [{
            functionDeclarations: [{
                name: "translate_block",
                description: `Translate the following ${inputTexts.length} texts into ${targetLang}.`,
                parameters: {
                    type: "object",
                    properties: properties,
                    required: Object.keys(properties)
                }
            }]
        }]

        const contents = [
            {
                role: "model",
                parts: [{
                    text: `I am a professional translation engine. My job is to translate the input text array into ${targetLang}, and return each translation using the defined function.`
                }]
            },
            {
                role: "user",
                parts: [{
                    text: JSON.stringify(inputTexts)
                }]
            }
        ]

        const translation = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents,
                tools,
                toolConfig: {
                    functionCallingConfig: {
                        mode: "ANY"
                    }
                }
            })
        })
        const response = await translation.json()
        if (response.error) {
            throw new Error(`Response Error: ${JSON.stringify(response.error)}`)
        }
        const functionCall = response.candidates?.[0]?.content?.parts?.[0]?.functionCall;
        if (!functionCall) {
            throw new Error(`Response Format is wrong: ${JSON.stringify(response)}`)
        }
        return functionCall.args
    }

    async openaiRequest(targetLang, inputTexts) {
        
        const model = this.models[this.apitype]
        const apikey = this.apikeys[this.apitype]

        // 構建 translation 物件的 schema 定義
        let properties = {}
        for (let i = 0; i < inputTexts.length; i++) {
            properties[`translation${i + 1}`] = {
                type: "string",
                description: `Translation of inputTexts[${i}] in ${targetLang}.`
            }
        }

        const translationSchema = {
            type: "function",
            function: {
                name: "translate_block",
                description: `Translate the following ${inputTexts.length} texts into ${targetLang}.`,
                parameters: {
                    type: "object",
                    properties: properties,
                    required: Object.keys(properties)
                }
            }
        }

        const messages = [
            {
                role: "system",
                content: `You are a professional translation engine. Translate exactly ${inputTexts.length} given sentences into ${targetLang}. Return them in the object format provided.`
            },
            {
                role: "user",
                content: `Please translate the ${inputTexts.length} predefined texts using the schema: ${JSON.stringify(inputTexts)}`
            }
        ]

        const translation = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apikey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                tools: [translationSchema],
                tool_choice: { type: "function", function: { name: "translate_block" } }
            })
        })
        const response = await translation.json()
        if (response.error) {
            throw new Error(`Reponse Error: ${JSON.stringify(response.error)}`)
        }
        let translated = response.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
        if (!translated) {
            throw new Error(`Reponse Format is wrong: ${JSON.stringify(response)}`)
        }
        const parsed = JSON.parse(translated)
        return parsed
    }

}

