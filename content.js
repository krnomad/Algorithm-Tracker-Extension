// content.js
console.log("✅ content.js injected");

function extractProblemData() {
  const metaTitle = document.querySelector("meta[property='og:title']")?.content;
  const header = document.querySelector("h1"),
        lessonTitle = document.querySelector(".lesson-title") || document.querySelector("div[class*=Title__StyledTitle]");

  const title = (lessonTitle?.textContent || header?.textContent || metaTitle || document.title).trim();
  const url = window.location.href;

  console.log("📋 추출된 제목:", title);
  return { title, url, difficulty: "", tags: [] };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXTRACT_PROBLEM") {
    try {
      const problem = extractProblemData();
      if (!problem.title || problem.title.length < 5) throw new Error("제목이 비정상적입니다.");
      sendResponse({ status: "ok", problem });
    } catch (err) {
      console.error("❌ 문제 추출 실패:", err);
      sendResponse({ status: "error", error: err.message });
    }
    return true;
  }

  if (message.type === "ADD_PROBLEM") {
    window.postMessage({
      type: "ADD_PROBLEM",
      payload: message.payload
    }, "*");
    console.log("📡 App.jsx로 문제 전송됨:", message.payload);
    sendResponse({ status: "forwarded" });
    return true;
  }
});
