import { Phase } from '@cm/types/project-creation'

export const phases: Phase[] = [
  {
    id: 1,
    title: '프로젝트 생성',
    question: '어떤 프로젝트를\n기획했나요?',
    type: 'form',
    inputType: 'text',
  },
  {
    id: 2,
    title: '프로젝트 이름',
    question: '좋아요! 프로젝트 이름이 정해졌나요?',
    type: 'chat',
    inputType: 'text',
  },
  {
    id: 3,
    title: '프로젝트 기간 설정',
    question: '멋진 이름이네요! 예상 기발 기간을 알려주세요.',
    type: 'chat',
    inputType: 'dateRange',
  },
  {
    id: 4,
    title: '프로젝트 인원 구성',
    question:
      '팀원을 초대해보세요. 기본적으로 한 명이 설정되어 있으며, 추가 버튼을 통해 더 많은 팀원을 추가할 수 있습니다.',
    type: 'chat',
    inputType: 'table',
  },
  {
    id: 5,
    title: '프로젝트 기능 정의서',
    question: '기능 정의서가 준비되어 있나요?',
    type: 'chat',
    inputType: 'file',
  },
  {
    id: 6,
    title: 'AI 피드백',
    question: 'AI가 생성한 기능 정의서에 대해 피드백을 작성해 주세요.',
    type: 'chat',
    inputType: 'text',
  },
  {
    id: 7,
    title: 'AI 피드백',
    question: 'AI가 생성한 기능 명세서에 대해 피드백을 작성해 주세요.',
    type: 'chat',
    inputType: 'text',
  },
  {
    id: 8,
    title: '최종 명세서 검토',
    question: '최종 명세서를 검토해주세요.',
    type: 'chat',
    inputType: 'text',
  },
]
