export function getSundaysInMonth(year, month) {
  const sundays = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() === 0) {
      sundays.push(date)
    }
  }

  return sundays
}

export function formatPosterDate(date) {
  const day = date.getDate()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}

export function getMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' }).toUpperCase()
}

export function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
