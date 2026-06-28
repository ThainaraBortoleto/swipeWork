<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border animate-in fade-in slide-in-from-top-2 duration-200"
        :class="toastClass(toast.type)"
      >
        <div class="flex items-center gap-3">
          <span class="text-lg">{{ toastIcon(toast.type) }}</span>
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button
            class="ml-auto shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            @click="remove(toast.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

function toastIcon(type: string) {
  const icons: Record<string, string> = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }
  return icons[type] || '•'
}

function toastClass(type: string) {
  const classes: Record<string, string> = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  }
  return classes[type] || 'bg-slate-500/10 border-slate-500/30 text-slate-400'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
