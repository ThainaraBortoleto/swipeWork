interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 3000,
    }

    toasts.value.push(newToast)

    if (newToast.duration) {
      setTimeout(() => {
        remove(id)
      }, newToast.duration)
    }

    return id
  }

  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return add({ message, type: 'success', duration })
  }

  function error(message: string, duration?: number) {
    return add({ message, type: 'error', duration })
  }

  function info(message: string, duration?: number) {
    return add({ message, type: 'info', duration })
  }

  function warning(message: string, duration?: number) {
    return add({ message, type: 'warning', duration })
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    success,
    error,
    info,
    warning,
  }
}
