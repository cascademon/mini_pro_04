# 도서관리 시스템 개발

React와 json-server를 이용한 초기 구현입니다. 도서 등록·조회·수정, 리뷰, 좋아요·북마크, 휴지통과 AI 표지 생성 흐름을 제공합니다.

## 개발 기간과 팀 역할

2026.05.22 - 2026.05.27

| 팀원 | 역할 |
| --- | --- |
| 성현욱 | 기획·조장·발표 |
| 김남효 | PPT 제작·CRUD 연동 |
| 류연우 | UI 레이아웃 |
| 박병린 | CRUD 연동 |
| 손가영 | PPT 제작·발표 문서 |
| 이채은 | OpenAI 연동 |
| 이채현 | 서기·스타일링·QA |
| 조영진 | 스타일링·QA |

## 실행

Node.js와 패키지 관리자를 준비한 뒤 패키지를 설치합니다.

```bash
pnpm install --frozen-lockfile
pnpm exec json-server --watch db.example.json --port 3000
```

다른 터미널에서 `pnpm run dev`를 실행합니다. API 기본 주소는 `http://localhost:3000`입니다.

`db.example.json`은 빈 도서·리뷰 목록으로 시작하는 데모 데이터입니다. 실행하면 이 파일에 도서·리뷰가 저장됩니다. 기존 `db.json`은 변경하지 않습니다. AI 표지는 사용자 API 키와 별도 사용 요금이 필요하며, 일반 도서 등록은 키 없이 사용할 수 있습니다.

## 구성

- `src/pages/`: 홈, 도서 목록·등록·상세, 휴지통
- `src/components/`: 도서·리뷰 입력과 목록 등 재사용 화면
- `src/api/`: 도서·리뷰 API 호출
- `src/styles/`: 화면 스타일
- `db.json`: 프로젝트 루트의 json-server 데이터

## 기능과 동작 범위

- 도서 CRUD와 리뷰 작성·수정·삭제
- 좋아요 수에 따른 인기 도서 표시 및 북마크
- 휴지통 이동·복구·영구 삭제
- 30일 경과 휴지통 정리는 휴지통 화면 진입 시 실행됩니다.
- AI 표지 후보 생성·선택
- 다크 모드 및 검색·정렬

초기 버전의 좋아요와 북마크는 공용 도서 데이터의 값입니다. 계정별 권한·개인화 기능으로 설명하지 않습니다.

## 보완한 부분

등록 요청이 성공했을 때만 입력을 초기화합니다. 실패하면 입력을 유지하고, 저장 중 중복 제출을 막습니다. API 포트 안내와 실제 기본 주소도 3000으로 통일했습니다.

## 관련 자료
검증 환경은 Node 24, pnpm 11입니다. `pnpm test`로 등록 실패·성공·중복 제출 처리를 검사하고, `pnpm run build`로 화면 빌드를 확인합니다.

- [확장 구현](https://github.com/cascademon/mini_pro-05)
- [결과보고서](https://docs.google.com/presentation/d/1ct-NoaqMevFIf8RDEN1KsdDU-_rES5PT/edit)
