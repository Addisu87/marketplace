export function formatDistanceToNow(date: Date, { addSuffix = true } = {}): string {
  const now = new Date().getTime()
  const diff = now - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let value: number
  let unit: string

  if (days > 0) {
    value = days
    unit = "day"
  } else if (hours > 0) {
    value = hours
    unit = "hour"
  } else if (minutes > 0) {
    value = minutes
    unit = "minute"
  } else {
    value = seconds
    unit = "second"
  }

  unit += value === 1 ? "" : "s"
  const base = `${value} ${unit}`

  return addSuffix ? `${base} ago` : base
}
