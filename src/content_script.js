translation = null
const maxSizePerRequest = 1000 //每個Request當中的文字長度總合

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  translation = new TranslateWorker(msg.apikeys, msg.apitype, msg.models)
  processor = new PageTranslator(msg.from, msg.to)
  processor.processSelectedNodes()
});

class PageTranslator {

  constructor(textNodeLang, textBoxLang) {
    this.textNodeLang = textNodeLang
    this.textBoxLang = textBoxLang
  }

  async processSelectedNodes() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ALL,
      {
        acceptNode: (node) => {
          // 範圍限制：只處理在 Range 內的 TextNode
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node = walker.currentNode;

    let currentTextbox = null;
    let selectedTextNodes = []
    while (node) {
      const textbox = node.findEditableElement() // 檢查是否為可編輯的元素
      if (textbox) {
        // 如果還沒記錄 textBox，就設定它
        if (!currentTextbox) {
          currentTextbox = textbox;
        }
      } else {
        // 不是textBox的情況
        if (currentTextbox) { // 如果有未處理的textBox，就處理它，接著把currentTextBox清掉
          await this.processTextBox(currentTextbox)
          currentTextbox = null
        }
        if (node.nodeType === 3) { // 一樣只針對文字node做處理
          selectedTextNodes.push(node) // 處理文字node
        }
      }
      node = walker.nextNode();
    }

    if (currentTextbox) {
      await this.processTextBox(currentTextbox)
      currentTextbox = null
    }

    this.processTextNodes(selectedTextNodes)
    // 清除選取
    selection.removeAllRanges();
  }

  splitNodeInfos(infos) {
    const chunks = [];
    let chunk = [];
    let tokenSize = 0;
    infos.forEach((info, index) => {
      chunk.push(info)
      tokenSize += info.node.nodeValue.length
      if (tokenSize >= maxSizePerRequest) { // 依據字串長度總和將nodes分成chunk
        chunks.push(chunk)
        chunk = []
        tokenSize = 0
      }
    })
    if (chunk.length != 0) {
      chunks.push(chunk)
    }
    return chunks;
  }

  async processTextNodes(nodes) {
    if (nodes.length === 0) {
      return;
    }

    let nodeInfos = []
    nodes.forEach((node, index) => {
      if (node.nodeValue.isMeaningfulText()) { // 先在每個node後方加入Loading Icon
        let span = node.withLoading()
        nodeInfos.push({ node: node, span: span })
        node.parentNode.replaceChild(span, node);
      }
    });

    let nodeInfoChunks = this.splitNodeInfos(nodeInfos) // 將nodes依據其字串長度總和(而非node數)分成數個chunk
    for (const chunk of nodeInfoChunks) {
      const inputTexts = chunk.map(x => x.node.nodeValue) // 逐個chunk送去LLM進行翻譯
      try {
        const results = await translation.tryTranslation(this.textNodeLang, inputTexts);
        chunk.forEach((nodeInfo, index) => { // 逐個更新已經翻譯好的字串
          nodeInfo.node.nodeValue = results[index]
          nodeInfo.span.parentNode.replaceChild(nodeInfo.node, nodeInfo.span)
        })
      } catch (error) {
        alert(error)
        chunk.forEach((nodeInfo, index) => { // 翻譯失敗，移除Loading Icon
          nodeInfo.span.parentNode.replaceChild(nodeInfo.node, nodeInfo.span)
        })
        break
      }
    }
  }

  async processTextBox(textBox) {
    let loadingBox = textBox.withLoading()
    textBox.parentNode.replaceChild(loadingBox, textBox)
    const fullText = textBox.innerText; // 或 textContent，視你需要
    try {
      const newText = await translation.tryTranslation(this.textBoxLang, [fullText]);
      if (newText) {
        await navigator.clipboard.writeText(newText[0]);
        console.log(`${newText[0]}`)
        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          cancelable: true,
          clipboardData: new DataTransfer(),
        });
        textBox.innerText = newText[0];
        loadingBox.parentNode.replaceChild(textBox, loadingBox)

        pasteEvent.clipboardData.setData("text/plain", newText)
        // 觸發事件
        await textBox.dispatchEvent(pasteEvent);
      }
    } catch (error) {
      alert(error)
      loadingBox.parentNode.replaceChild(loadingBox, textBox)
    }
  }
}