import toast from 'react-hot-toast'

export const kunErrorHandler = <T>(
  res: T | string,
  callback: (res: T) => void
) => {
  if (typeof res === 'string') {
    try {
      const parsedRes = JSON.parse(res)

      if (Array.isArray(parsedRes)) {
        const errorMessages = parsedRes
          .map((err) =>
            typeof err.message === 'string' ? err.message : '发生未知错误'
          )
          .join('\n')
        toast.error(errorMessages)
      } else if (typeof parsedRes === 'object' && parsedRes.message) {
        toast.error(parsedRes.message)
      } else {
        toast.error('发生未知错误')
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error(res)
    }
  } else {
    callback(res)
  }
}
