class TranslateWorker {

    maxTryCount = 3 // 每個Request的Retry次數

    constructor(apiKey, model) {
        this.apikey = apiKey
        this.model = model
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
        const apikey = this.apikey
        const model = this.model
        if (!apikey) {
            throw new Error("請輸入你的APIKey")
        }

        // 構建 translation 物件的 schema 定義
        let properties = {}
        for (let i = 0; i < inputTexts.length; i++) {
            properties[`translation${i + 1}`] = {
                type: "string",
                description: `Translation of inputTexts[${i}]" in ${targetLang}.`
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
}

