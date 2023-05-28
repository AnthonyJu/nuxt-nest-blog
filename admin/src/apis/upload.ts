interface UploadFileParams {
  file: File
  rmFile?: string
}

export function uploadAvatar(data: UploadFileParams) {
  // FormData
  const formData = new FormData()
  formData.append('file', data.file)
  if (data.rmFile) formData.append('rmFile', data.rmFile)

  return request({
    url: '/upload/avatar',
    method: 'post',
    data: formData,
  })
}

export function uploadFile(data: UploadFileParams) {
  // FormData
  const formData = new FormData()
  formData.append('file', data.file)

  return request({
    url: '/upload',
    method: 'post',
    data: formData,
  })
}
