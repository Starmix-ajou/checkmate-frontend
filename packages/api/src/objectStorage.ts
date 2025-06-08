import { API_BASE_URL } from './constants'

export interface PresignedUrlResponse {
  presignedUrl: string
  url: string
  expiredAt: string
}

export interface PresignedUrlRequest {
  bucket: 'DEFINITION'
  fileName: string
}

export const getPresignedUrl = async (
  accessToken: string,
  body: PresignedUrlRequest
): Promise<PresignedUrlResponse> => {
  const response = await fetch(`${API_BASE_URL}/object-storage/presigned-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Failed to get presigned URL')
  }

  return response.json()
}

export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-amz-acl': 'public-read',
    },
    body: file,
  })

  if (!response.ok) {
    throw new Error('Failed to upload file')
  }
}
