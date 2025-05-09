export const generateRandomCode = (length: number) => {
  const charset = '023456789abcdefghjkmnopqrstuvwxyz'
  let code = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    code += charset[randomIndex]
  }
  return code.toUpperCase()
}
