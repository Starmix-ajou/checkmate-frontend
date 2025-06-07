export const getNotification = async (
  accessToken: string,
  projectId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sse/notification?projectId=${projectId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!res.ok) throw new Error(`알림 수신 실패: ${res.status}`)
  } catch (error) {
    console.error('알림 수신 에러:', error)
    throw error
  }
}
