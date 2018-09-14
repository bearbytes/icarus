export function createId(prefix: string) {
  return (
    prefix +
    ':' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}
