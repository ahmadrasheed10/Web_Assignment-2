export function hasEventPassed(event, now = new Date()) {
  if (event.dateTime) {
    const start = new Date(event.dateTime).getTime()
    if (Number.isFinite(start)) return start <= now.getTime()
  }
  if (!event.date) return false
  let today
  try {
    const parts = new Intl.DateTimeFormat('en', { timeZone: event.timezone || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now)
    const value = (type) => parts.find((part) => part.type === type).value
    today = `${value('year')}-${value('month')}-${value('day')}`
  } catch {
    today = now.toISOString().slice(0, 10)
  }
  return event.date < today
}
