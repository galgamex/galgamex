export const isPatchPath = (pathname: string): boolean => {
  return /^\/[A-Za-z0-9]{8}$/.test(pathname)
}

export const isTagPath = (pathname: string): boolean => {
  return /^\/tag\/\d+/.test(pathname)
}

export const isUserPath = (pathname: string): boolean => {
  return /^\/user\/\d+/.test(pathname)
}

export const isDocPath = (pathname: string): boolean => {
  return /^\/doc\/.*/.test(pathname)
}
