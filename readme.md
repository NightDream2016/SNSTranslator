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

![image](https://github.com/user-attachments/assets/9dd76250-dea2-4671-a6de-5f25c641390f)

- 我使用的語言：
  就是你目前用的語言。預設為繁體中文。
  設定好以後，你選擇了網頁上非輸入區的文字後按右鍵，就可以翻譯成這個語言。
- 其他人使用的語言：
  想要對話的對象使用的語言。預設為日文。
  設定好以後，當你選取輸入框自己輸入的文字後按右鍵，點選「翻譯選取文字」，就能翻譯成這個語言。
- API類型 (Gemini/OpenRouter)
  選擇要使用的API類型，預設為Google Gemini (提供免費Key可申請)。
- LLM模型
  所要使用的AI模型，不同的模型會有不同的翻譯結果。選擇不同的API會有不同的模型可以選。
- APIKey
  到下面提供的連結申請APIKey之後，選擇對應的API類型填在這裡。

### APIKey申請方式：
- Gemini (可免費使用)
https://ai.google.dev/gemini-api/docs/api-key?hl=zh-tw

- OpenRouter (僅提供付費模型)
https://openrouter.ai/settings/keys

請註冊帳號並申請一個APIKey，之後選擇對應的API服務並填寫APIKey，就可以開始使用了。

## 使用流程

當在輸入框中輸入文字時，選擇輸入框當中文字，右鍵點選「翻譯選取文字」，會將自己輸入的文字翻譯為「其他人使用的語言」。
![01](https://github.com/user-attachments/assets/9ad4ec71-b65d-4dc2-a654-9ad8a59d369d)

當選擇輸入框以外的文字時，右鍵點選「翻譯選取文字」，會將網頁上的文字翻譯為「自己使用的語言」。
![02](https://github.com/user-attachments/assets/0d78d755-2fef-4bc2-b69b-09cd84de3ff5)


由此就可以用一樣的操作，在SNS上和不同語言的人交流了。
