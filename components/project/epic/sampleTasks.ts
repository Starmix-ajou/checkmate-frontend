import { Task } from '@/types/public-types'

export const allTasks: Task[] = [
  {
    id: 'infra',
    name: '인프라 구축',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 7),
    type: 'project',
    progress: 0,
    hideChildren: false,
    dependencies: [],
  },
  {
    id: '5-1-1',
    name: 'Kubernetes Cluster 구축',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 3),
    type: 'task',
    progress: 0,
    dependencies: [],
    project: 'infra',
  },
  {
    id: '5-1-2',
    name: 'CI/CD 구축',
    start: new Date(2025, 3, 3),
    end: new Date(2025, 3, 7),
    type: 'task',
    progress: 0,
    dependencies: ['5-1-1'],
    project: 'infra',
  },
  {
    id: 'ai_models',
    name: 'AI 모델 학습',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 13),
    type: 'project',
    progress: 0,
    hideChildren: false,
    dependencies: [],
  },
  {
    id: '5-2-1',
    name: '기능 정의서 초안 작성 및 수정 (all-MiniLM-L6-v2 재학습)',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 5),
    type: 'task',
    progress: 0,
    dependencies: [],
    project: 'ai_models',
  },
  {
    id: '5-2-2',
    name: '기능 명세서 자동 완성 (all-MiniLM-L6-v2 재학습)',
    start: new Date(2025, 3, 5),
    end: new Date(2025, 3, 9),
    type: 'task',
    progress: 0,
    dependencies: ['5-2-1'],
    project: 'ai_models',
  },
  {
    id: '5-2-3',
    name: '회의록 액션 아이템 추출, 회의록 요약 (BAAI/bge-m3 재학습)',
    start: new Date(2025, 3, 9),
    end: new Date(2025, 3, 13),
    type: 'task',
    progress: 0,
    dependencies: ['5-2-2'],
    project: 'ai_models',
  },
  {
    id: 'ui_poc',
    name: 'UI 라이브러리 PoC',
    start: new Date(2025, 3, 6),
    end: new Date(2025, 3, 15),
    type: 'project',
    progress: 0,
    hideChildren: false,
    dependencies: [],
  },
  {
    id: '5-3-1',
    name: 'Gantt Chart 제작 라이브러리 PoC',
    start: new Date(2025, 3, 6),
    end: new Date(2025, 3, 9),
    type: 'task',
    progress: 0,
    dependencies: [],
    project: 'ui_poc',
  },
  {
    id: '5-3-2',
    name: 'Kanban Board 제작 라이브러리 PoC',
    start: new Date(2025, 3, 9),
    end: new Date(2025, 3, 12),
    type: 'task',
    progress: 0,
    dependencies: ['5-3-1'],
    project: 'ui_poc',
  },
  {
    id: '5-3-3',
    name: 'Live Blocks를 활용한 공동 편집 라이브러리 PoC',
    start: new Date(2025, 3, 12),
    end: new Date(2025, 3, 15),
    type: 'task',
    progress: 0,
    dependencies: ['5-3-2'],
    project: 'ui_poc',
  },
  {
    id: 'project_creation',
    name: '프로젝트 생성 기능',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 12),
    type: 'project',
    progress: 0,
    hideChildren: false,
    dependencies: [],
  },
  {
    id: '1-1-1',
    name: '프로젝트 이름(제목) 입력 UI 구현',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 2),
    type: 'task',
    progress: 0,
    dependencies: [],
    project: 'project_creation',
  },
  {
    id: '1-1-2',
    name: '프로젝트 개발 기간 입력 UI/UX 설계 및 구현',
    start: new Date(2025, 3, 2),
    end: new Date(2025, 3, 6),
    type: 'task',
    progress: 0,
    dependencies: ['1-1-1'],
    project: 'project_creation',
  },
  {
    id: '1-1-3',
    name: '프로젝트 참여 인원 및 개발 수준 입력 UI 구현',
    start: new Date(2025, 3, 6),
    end: new Date(2025, 3, 9),
    type: 'task',
    progress: 0,
    dependencies: ['1-1-2'],
    project: 'project_creation',
  },
  {
    id: '1-1-4',
    name: '사용할 프레임워크 선택 UI 구현',
    start: new Date(2025, 3, 9),
    end: new Date(2025, 3, 10),
    type: 'task',
    progress: 0,
    dependencies: ['1-1-3'],
    project: 'project_creation',
  },
  {
    id: '1-1-5',
    name: '프로젝트 정보 저장 API 개발',
    start: new Date(2025, 3, 10),
    end: new Date(2025, 3, 12),
    type: 'task',
    progress: 0,
    dependencies: ['1-1-4'],
    project: 'project_creation',
  },
  {
    id: 'team_invitation',
    name: '팀원 초대 기능',
    start: new Date(2025, 3, 12),
    end: new Date(2025, 3, 22),
    type: 'project',
    progress: 0,
    hideChildren: false,
    dependencies: ['project_creation'],
  },
  {
    id: '1-2-1',
    name: '이메일 기반 팀원 초대 UI 구현',
    start: new Date(2025, 3, 12),
    end: new Date(2025, 3, 16),
    type: 'task',
    progress: 0,
    dependencies: ['1-1-5'],
    project: 'team_invitation',
  },
  {
    id: '1-2-2',
    name: '초대 이메일 발송 API 개발',
    start: new Date(2025, 3, 16),
    end: new Date(2025, 3, 17),
    type: 'task',
    progress: 0,
    dependencies: ['1-2-1'],
    project: 'team_invitation',
  },
  {
    id: '1-2-3',
    name: '팀원 초대 승인 및 거절 UI 구현',
    start: new Date(2025, 3, 17),
    end: new Date(2025, 3, 19),
    type: 'task',
    progress: 0,
    dependencies: ['1-2-2'],
    project: 'team_invitation',
  },
  {
    id: '1-2-4',
    name: '팀원 초대 승인 및 거절 API 개발',
    start: new Date(2025, 3, 19),
    end: new Date(2025, 3, 21),
    type: 'task',
    progress: 0,
    dependencies: ['1-2-3'],
    project: 'team_invitation',
  },
  {
    id: '1-2-5',
    name: '팀원 목록 조회 및 관리 API 개발',
    start: new Date(2025, 3, 21),
    end: new Date(2025, 3, 22),
    type: 'task',
    progress: 0,
    dependencies: ['1-2-4'],
    project: 'team_invitation',
  },
]
