export enum Position {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Designer = 'Designer',
  PM = 'PM',
  QA = 'QA',
  Mobile = 'Mobile',
}

export enum Stack {
  NextJS = 'Next.js',
  TypeScript = 'TypeScript',
  React = 'React',
  NodeJS = 'Node.js',
  NestJS = 'NestJS',
  PostgreSQL = 'PostgreSQL',
  TailwindCSS = 'TailwindCSS',
  Figma = 'Figma',
  ReactNative = 'React Native',
  Swift = 'Swift',
  Kotlin = 'Kotlin',
}

export type TeamMember = {
  email: string
  positions: Position
  stacks: Stack[]
}
