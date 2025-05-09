export const sliceUntilDelimiterFromEnd = (
  input: string = '',
  delimiter: string = '\n\n'
) => {
  const lastDelimiterIndex = input.lastIndexOf(delimiter)
  if (lastDelimiterIndex === -1) {
    return input
  }
  return input.slice(lastDelimiterIndex + delimiter.length)
}
