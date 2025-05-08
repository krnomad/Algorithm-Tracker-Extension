document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("extractBtn");
  
    async function sendMessageWithRetry(tabId, message, retries = 5, delay = 500) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (res) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(res);
              }
            });
          });
          return response;
        } catch (err) {
          console.log(`📡 재시도 ${i + 1}/${retries}...`, err.message);
          await new Promise(r => setTimeout(r, delay));
        }
      }
      throw new Error("📛 message 전송 실패: content.js가 준비되지 않음");
    }
  
    button.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      if (!tab || !tab.url.includes("programmers.co.kr/learn/courses/30/lessons")) {
        alert("⚠️ 프로그래머스 문제 페이지에서만 사용할 수 있습니다.");
        return;
      }
  
      const [{ result: problem }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const titleElement =
              document.querySelector("h1.lesson-title") ||
              document.querySelector("h1") ||
              document.querySelector("h2") ||
              document.querySelector("[class*=title]");
            const title = titleElement?.innerText.trim() || "Untitled";
          
            return {
              id: Date.now(),
              title,
              url: window.location.href,
              difficulty: "",
              tags: [],
              reviews: [0, 1, 3, 7, 14].map(offset => {
                const d = new Date();
                d.setDate(d.getDate() + offset);
                return d.toISOString().split("T")[0];
              }),
              reviewed: []
            };
        }
          
      });
  
      const trackerTabs = await chrome.tabs.query({
        url: "*://algorithm-tracker.vercel.app/*"
      });
  
      let targetTabId;
  
      if (trackerTabs.length > 0) {
        targetTabId = trackerTabs[0].id;
      } else {
        const newTab = await chrome.tabs.create({ url: "https://algorithm-tracker.vercel.app" });
        await new Promise(resolve => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === newTab.id && info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
            }
          });
        });
        targetTabId = newTab.id;
      }
  
    
  
      try {
        await sendMessageWithRetry(targetTabId, {
          type: "ADD_PROBLEM",
          payload: problem
        });
      
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon48.png",
          title: "Algorithm Tracker",
          message: "✅ 문제 데이터를 알고리즘 트래커에 전송했습니다."
        });
      
        setTimeout(() => window.close(), 500); // 알림 표시 후 0.5초 뒤 팝업 닫기
      
      } catch (e) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon48.png",
          title: "전송 실패",
          message: `📛 ${e.message}`
        });
      }
           
    });
  });