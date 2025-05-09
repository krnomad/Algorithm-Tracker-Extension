# 🧩 Algorithm Tracker Helper (Chrome Extension)

**Algorithm Tracker Helper**는 [Programmers](https://school.programmers.co.kr) 문제 페이지에서 문제 정보를 추출하여, [Algorithm Tracker Web App](https://algorithm-tracker.vercel.app/)에 전송하는 크롬 확장 프로그램입니다.

> ✅ 향후 Supabase 기반 백엔드 연동도 고려 중입니다.

---

## ✨ 주요 기능

- Programmers 문제 페이지에서 문제 제목과 URL 자동 추출
- Tracker Web App 탭으로 데이터 전송
- React 기반 앱에서 `localStorage`로 데이터 관리
- 확장 프로그램 팝업 UI를 통한 단일 클릭 작동

---

## 🧩 사용 방법

### 1. 이 저장소를 클론하거나 다운로드
```bash
git clone https://github.com/your-username/algorithm-tracker-helper.git
```

### 2. 크롬 확장 프로그램 등록
- `chrome://extensions` 접속
- 우측 상단 “개발자 모드” 활성화
- “압축 해제된 확장 프로그램 로드” 클릭
- 해당 폴더 선택

### 3. 사용하는 방법
- [Programmers 문제 페이지](https://school.programmers.co.kr/learn/courses/30/lessons/XXXX)로 이동
- 확장 버튼 클릭 → 자동으로 Tracker 탭에 문제 등록
- Tracker 웹앱이 열린 상태여야 정상 동작

---

## 🔧 기술 구성

| 구성 요소 | 설명 |
|-----------|------|
| **content.js** | Programmers/Tracker 페이지에 자동 삽입. 메시지 수신 및 `window.postMessage()`로 React 앱과 연동 |
| **popup.js** | 확장 버튼 클릭 시 실행. 문제 추출 → Tracker 탭으로 전달 |
| **App.jsx** (Tracker Web App) | React 앱에서 `postMessage` 수신 후 `localStorage`에 저장 |
| **manifest.json** | MV3 기반 확장 구성 파일. content_scripts 자동 삽입 포함 |

---

## 📈 향후 계획

- Supabase 백엔드 연동 및 인증 추가
- 다중 플랫폼 문제 페이지 대응
- 자동 태그 추론, 난이도 분석 등 AI 기능 추가

---

## 📄 라이선스

MIT License