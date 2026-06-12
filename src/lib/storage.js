const STORAGE_KEY = 'excelPosterData'
const SCHEDULE_KEY = 'excelPosterSchedule'

export function saveExcelData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadExcelData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearExcelData() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SCHEDULE_KEY)
}

export function saveSchedule(schedule) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule))
}

export function loadSchedule() {
  const raw = localStorage.getItem(SCHEDULE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
