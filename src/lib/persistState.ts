export function storeState(name: string, state: any) {
  localStorage.setItem(name, JSON.stringify(state))
}

export function fetchState<T>(name: string): T | null {
  const json = localStorage.getItem(name)
  if (!json) return null
  return JSON.parse(json) as T
}

export function clearState(name: string) {
  localStorage.removeItem(name)
}
