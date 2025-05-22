export enum Position {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Designer = 'Designer',
  PM = 'PM',
  QA = 'QA',
  Mobile = 'Mobile',
}

export type TeamMember = {
  email: string
  positions: Position[]
}
