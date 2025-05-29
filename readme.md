# AI翻譯小工具

自用，利用LLM API進行使用者選擇的文字區塊的翻譯。
主要用途是**除了瀏覽異國網頁外，也可在輸入文字和異國使用者對話時翻譯自己的文字為異國語言**。

## 安裝方法

1. 點選右上角的Code鍵→Download Zip
2. 將Zip解壓縮
3. 打開Edge/Chrome，打開「開發人員模式」，點「載入解壓縮檔案」
4. 選擇解壓縮後的`package`目錄
5. 即可開始使用

## 使用方法
需要在設定區當中指定「我使用的語言」、「其他人使用的語言」、「LLM模型」、「API選擇 (Gemini/OpenRouter)」、「APIKey」。

### APIKey申請方式：
- Gemini (可免費使用)
https://ai.google.dev/gemini-api/docs/api-key?hl=zh-tw

- OpenRouter (僅提供付費模型)
https://openrouter.ai/settings/keys

請註冊帳號並申請一個APIKey，之後選擇對應的API服務並填寫APIKey，就可以開始使用了。

## 使用流程
當在框中輸入文字時，選擇輸入框當中文字，右鍵點選「翻譯選取文字」，會將輸入的文字翻譯為「其他人使用的語言」。
當選擇輸入框以外的文字時，右鍵點選「翻譯選取文字」，會將輸入的文字翻譯為「自己使用的語言」。
