# checkmate-frontend
![체크메이트썸네일](https://i.imgur.com/rpwI0gG.png)

- 🌟 Starmix Organization GitHub : [https://github.com/Starmix-ajou](https://github.com/Starmix-ajou)
- ♟ checkmate URL : [https://checkmate.it.kr](https://checkmate.it.kr)
- 🖥 Project Manager 전용 뷰 : [https://manager.checkmate.it.kr](https://manager.checkmate.it.kr)
- 📘 Storybook UI 문서 : [https://storybook.checkmate.it.kr](https://storybook.checkmate.it.kr)

## 프로젝트 소개

**checkmate는 소규모 주니어 개발팀을 위한 프로젝트 관리 및 협업툴입니다.**

AI를 활용한 프로젝트 생성과 Sprint 구성, 회의록 자동 요약 기능을 제공하여 팀의 초기 기획부터 실행까지의 과정을 효율적으로 지원합니다. 
회의 내용을 실시간으로 정리할 수 있는 공동 편집 기능을 통해 주요 논의 사항을 요약하고, 이를 실행 가능한 액션 아이템(Task)으로 전환할 수 있습니다. 
Task는 Epic 단위로 구조화할 수 있으며, Gantt Chart, Kanban Board, Calendar를 통해 관리할 수 있습니다. 
또한 상세 Task 페이지의 댓글 기능을 통해 팀 내부 이해관계자 간의 원활한 소통이 가능하도록 하여, 개발 과정 전반에서 협업의 생산성을 높입니다.

## 팀원 구성

<div align="center">

| 김평주 | 한도연 |
| --- | --- |
| <img src="https://i.imgur.com/fX38Yot.png" width="200" height="200"/> | <img src="https://i.imgur.com/2tL2MmG.png" width="200" height="200"/> |

</div>
<br>

## 1. 개발 환경

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-602c3c?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEVHcExXQzpKQDlFV16lpqyGh4tPPTdWT0weHRU7LRZGQzmxYjlaTkZsbmywVyxtXDSFhISXm6WWpcaytb6bm56gprY0LiiXmp2prLamsMa0XS42MSxkTUVDSkuyYzGihXdDV2GprbmedVxaRD1kTUWUdGFGOCN4a2OfpbI0SFFAMSddTkbCc0dWQiGFRypXQyJUQCBcTTWviDVXQyJcUDjlqCWxjkG+hBTiohtURD6lr8lORTtDVVZmPyxwSipaRSJDOzaWpsyYqMyYqM2dq8tPOjBERTs6QUKTcCeKaCJvViZdSDK4iSngoiDvqx7KkRuGEi1hAAAAOXRSTlMApZ78cB8hCAMQO/j/FOH4KlT1wFfJTjaY6SxtVexFn3Tn2sN6d671mVuJ+/PPN9CT6TfpS4C9jJaVLRihAAAAi0lEQVQIHXXBxRKCUAAF0Es/QMDubsVuGrv1///GBQ4bx3PwgwC8gFCRohs8QrQV0ZtKOZ9JcgBmU8MwqFa9kjNTUWB58f2jPOjU9juTBTbPq+vIar972MZjwPr1uDvqCFw2wQpQVm/t7Oo9gAgAFtrtZNtMFQFp7nkWU5IQECfjYbuQFvBFRJHgjw9L0A80UmaGpAAAAABJRU5ErkJggg==)
![shadcn](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge)

### 형상 관리 및 구성
![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

### 상태 관리
![Zustand](https://img.shields.io/badge/zustand-602c3c?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAA8FBMVEVHcExXQzpKQDlFV16lpqyGh4tPPTdWT0weHRU7LRZGQzmxYjlaTkZsbmywVyxtXDSFhISXm6WWpcaytb6bm56gprY0LiiXmp2prLamsMa0XS42MSxkTUVDSkuyYzGihXdDV2GprbmedVxaRD1kTUWUdGFGOCN4a2OfpbI0SFFAMSddTkbCc0dWQiGFRypXQyJUQCBcTTWviDVXQyJcUDjlqCWxjkG+hBTiohtURD6lr8lORTtDVVZmPyxwSipaRSJDOzaWpsyYqMyYqM2dq8tPOjBERTs6QUKTcCeKaCJvViZdSDK4iSngoiDvqx7KkRuGEi1hAAAAOXRSTlMApZ78cB8hCAMQO/j/FOH4KlT1wFfJTjaY6SxtVexFn3Tn2sN6d671mVuJ+/PPN9CT6TfpS4C9jJaVLRihAAAAi0lEQVQIHXXBxRKCUAAF0Es/QMDubsVuGrv1///GBQ4bx3PwgwC8gFCRohs8QrQV0ZtKOZ9JcgBmU8MwqFa9kjNTUWB58f2jPOjU9juTBTbPq+vIar972MZjwPr1uDvqCFw2wQpQVm/t7Oo9gAgAFtrtZNtMFQFp7nkWU5IQECfjYbuQFvBFRJHgjw9L0A80UmaGpAAAAABJRU5ErkJggg==)

### 정적 분석 및 포맷팅
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)

### 문서화 및 스타일 가이드
![Storybook](https://img.shields.io/badge/-Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)

### 디자인 협업
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)

### 배포 플랫폼
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

### 협업 툴
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

### 이슈 및 버전 관리
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)

### 테스트
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## 2. 채택한 개발 기술과 브랜치 전략

### React 19 & Next 15
최신 React 기능과 App Router 기반의 파일 시스템 라우팅을 통해 구조적이고 효율적인 페이지 설계가 가능하며, Next.js의 서버 컴포넌트와 서버 액션을 적극 활용해 클라이언트-서버 간 경계를 명확히 유지.

### Turborepo + pnpm
모노레포 환경에서 각 앱과 패키지의 의존성 캐싱, 병렬 빌드, 파이프라인 최적화를 지원해 CI/CD 속도를 대폭 개선하고, 작업 분리를 명확하게 유지할 수 있도록 지원.

### Liveblocks
회의록 및 Sprint 계획 도구에서 다중 사용자 동시 편집 기능을 구현하기 위해 도입, Google Docs와 유사한 경험을 제공하면서도 구현 난이도는 낮춤.

### Zustand
가볍고 직관적인 상태 관리 라이브러리로, Redux 대비 코드량을 최소화하면서도 React 컴포넌트와의 높은 호환성을 제공하여 빠른 개발 주기에 적합.

### shadcn/ui + TailwindCSS
일관된 디자인 시스템을 빠르게 구현할 수 있도록 도와주는 headless 컴포넌트 기반 UI 라이브러리, TailwindCSS와 결합해 생산성과 커스터마이징 유연성 확보.

### Storybook
`packages/ui`에 정의된 공통 컴포넌트를 시각화, 테스트, 문서화함으로써 개발자 간 또는 디자이너-개발자 간 협업 품질을 높임.

### 브랜치 전략

- 브랜치 명: **Jira 태스크 ID 기반**
  - ex) `CM-123`
- **Rebase Merge** 방식으로 main 브랜치에 병합
- **최소 1명 이상의 approve** 필요

## 3. Challenge

## 4. 프로젝트 구조
``` bash
.
├── .github              # GitHub 설정 및 워크플로우
├── apps
│   ├── manager          # Product Manager 전용 뷰
│   └── web              # 메인 사용자 프론트엔드 앱
├── packages
│   ├── api              # 공통 API 클라이언트 패키지
│   ├── ui               # 디자인 시스템 및 컴포넌트 (Storybook으로 문서화)
│   └── types            # 공유 타입 정의
├── pnpm-workspace.yaml  # 워크스페이스 설정
├── turbo.json           # 터보레포 구성
└── package.json
```

## 5. 구조적 장점
### 모노레포 기반 앱 분리
`apps/web`과 `apps/manager`로 사용자와 관리자 뷰를 분리하여 역할별 개발이 명확하고 독립적인 배포가 가능함.

### 패키지 단위의 코드 재사용
`packages/ui`, `packages/types`, `packages/api` 등 공통 모듈을 분리하여 중복 제거와 일관된 인터페이스 유지.

### Turborepo로 빠른 빌드와 캐싱 최적화
의존성 그래프 기반 병렬 빌드와 캐시를 통해 CI/CD 시간과 로컬 개발 빌드 시간을 크게 단축.

### Storybook을 통한 UI 문서화 및 테스트
공통 컴포넌트를 시각화하고, 디자인 시스템을 공유하며, UI 테스트를 용이하게 함.

### 공통 타입과 API 클라이언트로 일관된 통신
`packages/types`와 `packages/api`를 통해 프론트 전체에서 타입 안정성과 요청 방식 통일성 확보.

### 역할 중심 브랜치 전략과 협업 흐름
Jira 이슈 키 기반 브랜치 명명과 디렉토리 기반 작업 분할로 충돌 없는 협업 가능.

### 배포 파이프라인 시간 단축
Turborepo와 Vercel을 통한 캐시 및 병렬 빌드로 배포 속도 최적화.

## 6. 테스트
Jest를 기반으로 Frontend 유닛 테스트를 수행

## 7. 개발 기간 및 작업 관리

### 개발 기간

- **2025-03-06 ~ (진행 중)**

### 작업 관리

- **협업 툴**: GitHub + Slack + Jira
- **회의**: 주 2회 팀 전체 회의 진행 + Google Docs로 회의록 공유
- **요청/QA 문서화**: Notion을 통해 요청 사항 정리 및 QA 문서로 재활용