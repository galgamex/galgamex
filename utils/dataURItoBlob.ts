export const dataURItoBlob = (dataURI: string) => {
  // 从 dataURI 中提取 MIME 类型
  const mimeMatch = dataURI.match(/data:([^;]+);base64,/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'

  const byteString = atob(dataURI.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeType })
}
