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
  const monthCache = schedule?.months || {}
  const payload = {
    monthValue: schedule?.monthValue || null,
    months: monthCache,
  }

  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(payload))
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
    const parsed = JSON.parse(raw)

    if (parsed?.months) {
      return parsed
    }

    if (parsed?.monthValue && parsed?.assignments) {
      return {
        monthValue: parsed.monthValue,
        months: {
          [parsed.monthValue]: parsed.assignments,
        },
      }
    }

    return {
      monthValue: parsed?.monthValue || null,
      months: parsed?.months || {},
    }
  } catch {
    return null
  }
}
