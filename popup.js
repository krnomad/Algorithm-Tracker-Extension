// popup.js (manifest content_scripts 사용 전제)
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("extractBtn");
  
    button.addEventListener("click", async () => {
      const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      // 1️⃣ 현재 탭이 Programmers 페이지인지 확인
      if (!currentTab.url.includes("school.programmers.co.kr")) {
        alert("⚠️ Programmers 문제 페이지에서 실행해주세요.");
        return;
      }
  
      // 2️⃣ 문제 추출 요청
      chrome.tabs.sendMessage(currentTab.id, { type: "EXTRACT_PROBLEM" }, async (response) => {
        if (chrome.runtime.lastError || !response?.problem) {
          console.error("❌ 추출 실패:", chrome.runtime.lastError?.message);
          alert("문제 제목 추출 실패");
          return;
        }
  
        const problem = response.problem;
  
        // 3️⃣ 트래커 탭 찾기
        const [trackerTab] = await chrome.tabs.query({ url: "*://algorithm-tracker.vercel.app/*" });
        if (!trackerTab) {
          alert("⚠️ 알고리즘 트래커 탭이 열려 있어야 합니다.");
          return;
        }
  
        // 4️⃣ 문제 전송
        chrome.tabs.sendMessage(trackerTab.id, {
          type: "ADD_PROBLEM",
          payload: problem
        }, (res) => {
          if (chrome.runtime.lastError) {
            console.error("❌ 전송 오류:", chrome.runtime.lastError.message);
            alert("문제 전송 중 오류 발생");
          } else {
            console.log("✅ 문제 전송 완료:", res);
            window.close();
          }
        });
      });
    });
  });
  