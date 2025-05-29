String.prototype.isMeaningfulText = function (minLength = 2) {

  if (!this) {
    return false;
  }

  // 去除前後空白
  const trimmed = this.trim();

  // 過短就略過（例如只剩 1 字元）
  if (trimmed.length < minLength) return false;

  // 檢查是否全為空白或換行
  if (/^[\s\n\r\t]*$/.test(trimmed)) return false;

  // 檢查是否為「只包含符號」的字串（含全形符號）
  if (/^[\p{P}\p{S}]+$/u.test(trimmed)) return false;

  return true;
}

Document.prototype.createLoading = function () {
  const loadingImg = document.createElement("img");
  loadingImg.src = chrome.runtime.getURL("loading.gif");
  loadingImg.alt = "Loading...";
  loadingImg.style.width = "16px";
  loadingImg.style.height = "16px";
  loadingImg.style.display = "inline-block";
  loadingImg.style.margin = "0";
  return loadingImg;
}

Node.prototype.withLoading = function () {
  const loadingImg = document.createLoading();
  const span = document.createElement("span");
  span.textContent = this.isEditableElement() ? this.parentNode?.innerText : this.nodeValue;
  span.appendChild(loadingImg);
  return span;
};

Node.prototype.isEditableElement = function () {
  const tag = this.tagName?.toLowerCase() ?? "";
  // HTML 標準可輸入元件
  if (["input", "textarea", "select"].includes(tag)) {
    return true;
  }
  // contenteditable 屬性
  if (this.isContentEditable ?? false) {
    return true;
  }
  // ARIA 規範支援
  const role = this.getAttribute?.("role") ?? "";
  if (["textbox", "combobox", "searchbox"].includes(role)) {
    return true;
  }
  return false
}

Node.prototype.findEditableElement = function () {
  // 若是文字節點，檢查其父元素
  const element = this.nodeType === Node.TEXT_NODE ? this.parentElement : this;
  if (element instanceof HTMLElement) {
    return element.isEditableElement() ? element : null;
  }
  return null;
};

Node.prototype.isChildOf = function (parent) {
  let current = this;
  while (current) {
    if (current === parent) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}