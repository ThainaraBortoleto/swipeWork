export function useDebounce(fn: Function, delay = 300) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}