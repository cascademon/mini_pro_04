[README.md](https://github.com/user-attachments/files/28294734/README.md)
## 📚 도서 관리 시스템

책 정보를 기록하고, AI로 표지를 생성해 나만의 창작 서재를 만드는 웹 애플리케이션<br>
단순한 도서 목록 관리를 넘어, AI 표지 이미지 생성·좋아요·북마크·리뷰 작성 등 다양한 기능을 통해
나만의 개성 있는 서재를 꾸밀 수 있습니다.
<br>
<br>
### 📅 개발 기간

26.05.22 - 26.05.27
<br>## 📚 도서 관리 시스템

책 정보를 기록하고, AI로 표지를 생성해 나만의 창작 서재를 만드는 웹 애플리케이션<br>
단순한 도서 목록 관리를 넘어, AI 표지 이미지 생성·좋아요·북마크·리뷰 작성 등 다양한 기능을 통해
나만의 개성 있는 서재를 꾸밀 수 있습니다.
<br>
<br>
### 📅 개발 기간

26.05.22 - 26.05.27
<br>
<br>
### 👨‍👦 팀원 구성

성현욱 -- PM-기획 - 조장 - 발표자<br>
김남효 -- PPT 제작, CRUD 연동<br>
류연우 -- UI-레이아웃<br>
박병린 -- CRUD 연동<br>
손가영 - PPT 제작, 발표-문서<br>
이채은 -- OpenAI 연동<br>
이채현 -- 서기, 스타일링-QA<br>
조영진 -- 스타일링-QA
<br>
<br>
### 📎 개발 환경

- Frontend (React 19, Vite, fetch)
- json-server
- OpenAI API (GPT Image 2)
<br>

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── BookForm.jsx      # 도서 추가/수정 폼
│   ├── BookItem.jsx      # 도서 카드 아이템
│   ├── BookList.jsx      # 도서 목록
│   ├── Header.jsx        # 상단 헤더 (다크모드 포함)
│   ├── ReviewForm.jsx    # 리뷰 입력 폼
│   ├── ReviewItem.jsx    # 리뷰 아이템
│   └── ReviewList.jsx    # 리뷰 목록
│
├── pages/               # 페이지 단위 컴포넌트
│   ├── AddBookPage.jsx   # 도서 등록 페이지
│   ├── BookDetailPage.jsx# 도서 상세 페이지
│   ├── BookListPage.jsx  # 도서 목록 페이지
│   ├── Home.jsx          # 홈 페이지
│   └── TrashPage.jsx     # 휴지통 페이지
│
├── styles/              # 컴포넌트별 CSS
│   ├── DarkMode.css      # 다크 모드 스타일
│   └── ...
│
├── App.jsx              # 라우팅 설정
├── main.jsx             # 앱 진입점
├── db.json              # json-server 데이터베이스
├── index.html           # 앱 기본 HTML 템플릿
├── package-lock.json    # 패키지 버전 고정 파일
├── package.json         # 프로젝트 설정 및 의존성 목록
├── vite.config.js       # Vite 빌드 도구 설정
└── README.md            # 프로젝트 소개
```

---
<br>

## 💾 데이터 구조 (db.json)

```json
{
    {
      "title": "상록수",
      "author": "박경리",
      "description": "여전히 웃음과 우정 속 갈등이 현재에서 할용되고 깊은 성찰 할수 있도록 '상록수' 내용을 새로이 담았습니다.",
      "releaseDate": "2026-04-24",
      "modifiedDate": "2026-05-22",
      "createdDate": "",
      "poster": "/default-book-cover.png",
      "likes": 6,
      "id": 1,
      "isDeleted": true,
      "deletedAt": "2026-05-27T00:53:07.565Z"
    },
}
```

## 📸 사이트 프리뷰

| 홈 화면 | 도서 등록 | 휴지통 |
|---------|---------|---------|
| ![홈](https://i.ifh.cc/4p1Hqp.jpg) | ![등록](https://i.ifh.cc/NOhBMR.jpg) | ![휴지통](https://i.ifh.cc/Y8VTJa.jpg) |

---
<br>

## 실행 방법

### 1. 패키지 다운로드 후 파일 주소에서 CMD 실행
```bash
npm install
```

### 2. 터미널 1개 추가 실행

**터미널 1 - json-server 실행**
```bash
npx json-server@0.17.4 --watch db.json --port 3001
```
→ http://localhost:3001/books 에서 확인

**터미널 2 - React 개발 서버 실행**
```bash
npm run dev
```
→ http://localhost:5173 에서 확인

---
<br>

## 📋 주요 기능

| 기능 | 설명 |
|------|------|
| 📝 **도서 추가 / 수정 / 삭제** | 제목, 저자, 장르 등 도서 정보를 자유롭게 등록하고 관리 |
| 🤖 **AI 표지 이미지 생성** | AI를 활용해 도서에 어울리는 표지 이미지를 자동 생성 |
| 👍 **좋아요 기능** | 마음에 드는 도서에 좋아요를 눌러 인기 순위 반영 |
| 🔖 **북마크 기능** | 나중에 다시 보고 싶은 도서를 북마크로 저장 |
| ✏️ **리뷰 작성 기능** | 도서 상세 페이지에서 리뷰를 작성하고 확인 |
| 🌙 **다크 모드** | 눈이 편한 다크 모드 / 라이트 모드 전환 |
| 🗑️ **휴지통 (삭제 복구)** | 삭제한 도서를 휴지통에서 복구하거나 영구 삭제 |
| 북마크 | 도서 북마크 및 홈 화면에서 북마크한 도서 시각화 |
| 리뷰 | 도서별 댓글 형태의 리뷰 작성 기능 |
| 정렬 · 검색 | 인기순 · 출판일순 · 가나다순 정렬 및 도서 검색 |
| 인기 도서 추천 | 홈 화면에서 좋아요 수 기준 인기 도서 실시간 집계 |
| 다크모드 | UI를 어둡게 처리하여 대비되는 색을 최소화 |

<br>
### 👨‍👦 팀원 구성

성현욱 -- PM-기획 - 조장 - 발표자<br>
김남효 -- PPT 제작, CRUD 연동<br>
류연우 -- UI-레이아웃<br>
박병린 -- CRUD 연동<br>
손가영 - PPT 제작, 발표-문서<br>
이채은 -- OpenAI 연동<br>
이채현 -- 서기, 스타일링-QA<br>
조영진 -- 스타일링-QA
<br>
<br>
### 📎 개발 환경

- Frontend (React 19, Vite, fetch)
- json-server
- OpenAI API (GPT Image 2)
<br>

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── BookForm.jsx      # 도서 추가/수정 폼
│   ├── BookItem.jsx      # 도서 카드 아이템
│   ├── BookList.jsx      # 도서 목록
│   ├── Header.jsx        # 상단 헤더 (다크모드 포함)
│   ├── ReviewForm.jsx    # 리뷰 입력 폼
│   ├── ReviewItem.jsx    # 리뷰 아이템
│   └── ReviewList.jsx    # 리뷰 목록
│
├── pages/               # 페이지 단위 컴포넌트
│   ├── AddBookPage.jsx   # 도서 등록 페이지
│   ├── BookDetailPage.jsx# 도서 상세 페이지
│   ├── BookListPage.jsx  # 도서 목록 페이지
│   ├── Home.jsx          # 홈 페이지
│   └── TrashPage.jsx     # 휴지통 페이지
│
├── styles/              # 컴포넌트별 CSS
│   ├── DarkMode.css      # 다크 모드 스타일
│   └── ...
│
├── App.jsx              # 라우팅 설정
├── main.jsx             # 앱 진입점
├── db.json              # json-server 데이터베이스
├── index.html           # 앱 기본 HTML 템플릿
├── package-lock.json    # 패키지 버전 고정 파일
├── package.json         # 프로젝트 설정 및 의존성 목록
├── vite.config.js       # Vite 빌드 도구 설정
└── README.md            # 프로젝트 소개
```

---
<br>

## 💾 데이터 구조 (db.json)

```json
{
    {
      "title": "상록수",
      "author": "박경리",
      "description": "여전히 웃음과 우정 속 갈등이 현재에서 할용되고 깊은 성찰 할수 있도록 '상록수' 내용을 새로이 담았습니다.",
      "releaseDate": "2026-04-24",
      "modifiedDate": "2026-05-22",
      "createdDate": "",
      "poster": "/default-book-cover.png",
      "likes": 6,
      "id": 1,
      "isDeleted": true,
      "deletedAt": "2026-05-27T00:53:07.565Z"
    },
}
```

---
<br>

## 실행 방법

### 1. 패키지 다운로드 후 파일 주소에서 CMD 실행
```bash
npm install
```

### 2. 터미널 1개 추가 실행

**터미널 1 - json-server 실행**
```bash
npx json-server@0.17.4 --watch db.json --port 3001
```
→ http://localhost:3001/books 에서 확인

**터미널 2 - React 개발 서버 실행**
```bash
npm run dev
```
→ http://localhost:5173 에서 확인

---
<br>

## 📋 주요 기능

| 기능 | 설명 |
|------|------|
| 📝 **도서 추가 / 수정 / 삭제** | 제목, 저자, 장르 등 도서 정보를 자유롭게 등록하고 관리 |
| 🤖 **AI 표지 이미지 생성** | AI를 활용해 도서에 어울리는 표지 이미지를 자동 생성 |
| 👍 **좋아요 기능** | 마음에 드는 도서에 좋아요를 눌러 인기 순위 반영 |
| 🔖 **북마크 기능** | 나중에 다시 보고 싶은 도서를 북마크로 저장 |
| ✏️ **리뷰 작성 기능** | 도서 상세 페이지에서 리뷰를 작성하고 확인 |
| 🌙 **다크 모드** | 눈이 편한 다크 모드 / 라이트 모드 전환 |
| 🗑️ **휴지통 (삭제 복구)** | 삭제한 도서를 휴지통에서 복구하거나 영구 삭제 |
| 북마크 | 도서 북마크 및 홈 화면에서 북마크한 도서 시각화 |
| 리뷰 | 도서별 댓글 형태의 리뷰 작성 기능 |
| 정렬 · 검색 | 인기순 · 출판일순 · 가나다순 정렬 및 도서 검색 |
| 인기 도서 추천 | 홈 화면에서 좋아요 수 기준 인기 도서 실시간 집계 |
| 다크모드 | UI를 어둡게 처리하여 대비되는 색을 최소화 |
