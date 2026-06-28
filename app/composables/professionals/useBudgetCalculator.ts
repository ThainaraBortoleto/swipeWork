export function useBudgetCalculator(hourlyRate: number) {
  const hours = ref<number>(1)

  const totalBudget = computed(() => hours.value * hourlyRate)

  const breakdown = computed(() => ({
    hourly: hourlyRate,
    hours: hours.value,
    total: totalBudget.value,
  }))

  function setHours(value: number) {
    if (value >= 0.5) {
      hours.value = Number((value).toFixed(1))
    }
  }

  function incrementHours(amount: number = 0.5) {
    setHours(hours.value + amount)
  }

  return {
    hours,
    totalBudget,
    breakdown,
    setHours,
    incrementHours,
  }
}
