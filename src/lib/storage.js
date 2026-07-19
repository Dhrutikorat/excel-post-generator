const STORAGE_KEY = 'excelPosterData'
const SCHEDULE_KEY = 'excelPosterSchedule'
const CUSTOM_CHARACTERS_KEY = 'excelPosterCustomCharacters'

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
  localStorage.removeItem(CUSTOM_CHARACTERS_KEY)
}

export function saveSchedule(schedule) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule))
}

export function saveCustomCharacters(data) {
  localStorage.setItem(CUSTOM_CHARACTERS_KEY, JSON.stringify(data))
}

export function loadCustomCharacters() {
  const raw = localStorage.getItem(CUSTOM_CHARACTERS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
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
