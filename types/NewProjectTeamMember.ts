export enum Position {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Designer = 'Designer',
  PM = 'PM',
  QA = 'QA',
  Mobile = 'Mobile',
}

export enum Stack {
  NextJS = 'NEXTJS',
  TypeScript = 'TypeScript',
  React = 'REACT',
  NodeJS = 'Node.js',
  NestJS = 'NESTJS',
  PostgreSQL = 'PostgreSQL',
  TailwindCSS = 'TailwindCSS',
  Figma = 'Figma',
  ReactNative = 'React Native',
  Spring = 'SPRING',
  Swift = 'Swift',
  Kotlin = 'Kotlin',
}

export type TeamMember = {
  email: string
  stacks: Stack[]
  positions: Position[]
}
