import { Feature } from '@/types/project-creation'
import { TeamMember } from '@/types/NewProjectTeamMember'
import { ProjectDefinitionBody } from '@/types/project-definition'

export const postProjectDefinition = async (
  accessToken: string,
  body: ProjectDefinitionBody
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/definition`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) throw new Error(`정의서 전송 실패: ${res.status}`)
  } catch (error) {
    console.error('정의서 전송 에러:', error)
    throw error
  }
}

export const putDefinitionFeedback = async (
  accessToken: string,
  feedback: string,
  selectedSuggestions: string[]
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/definition`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          feedback: feedback + '\n 선택한 기능 목록: ' + selectedSuggestions.join(', '),
        }),
      }
    )

    if (!res.ok) throw new Error(`피드백 전송 실패: ${res.status}`)
  } catch (error) {
    console.error('피드백 전송 에러:', error)
    throw error
  }
}

export const putSpecificationFeedback = async (
  accessToken: string,
  feedback: string,
  modifiedFeatures: Feature[]
) => {
  try {
    const modifiedFeaturesText = modifiedFeatures
      .map(
        (feature) =>
          `기능명:${feature.name}+사용사례:${feature.useCase}+입력:${feature.input}+출력:${feature.output}`
      )
      .join('\n')

    const fullFeedback = feedback + '\n 수정된 기능 명세:\n' + modifiedFeaturesText

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/specification`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          feedback: fullFeedback,
        }),
      }
    )

    if (!res.ok) throw new Error(`피드백 전송 실패: ${res.status}`)
  } catch (error) {
    console.error('피드백 전송 에러:', error)
    throw error
  }
}

export const getSpecification = async (accessToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/project/specification`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`명세 단계 전환 실패: ${res.status}`)
  } catch (error) {
    console.error('명세 단계 전환 에러:', error)
    throw error
  }
}
