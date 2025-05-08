chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADD_PROBLEM") {
    const key = "algo_problems";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(message.payload);
    localStorage.setItem(key, JSON.stringify(existing));

    console.log("✅ 문제 추가 완료 (content.js)");
    window.location.reload();

    sendResponse({ status: "ok" });
  }
});
