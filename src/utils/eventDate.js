export function hasEventPassed(event, now = new Date()) {
  if (event.dateTime) {
    const start = new Date(event.dateTime).getTime()
    if (Number.isFinite(start)) return start <= now.getTime()
  }
  if (!event.date) return false
  let today
  try {
    today = now.toLocaleDateString('en-CA', { timeZone: event.timezone || 'UTC' })
  } catch {
    today = now.toISOString().slice(0, 10)
  }
  return event.date < today
}
