const TARGET_SHEET = 'teams'

const COLUMN_MAP = {
  story: ['story'],
  character: ['character'],
}

const SKIP_CHARACTERS = new Set(['all characters', 'all'])

function normalizeHeader(value) {
  return String(value ?? '').trim().toLowerCase()
}

function findColumnKey(headers, aliases) {
  return headers.find((header) => aliases.includes(normalizeHeader(header)))
}

function getTeamColumnKeys(headers) {
  return headers.reduce((result, header) => {
    const normalized = normalizeHeader(header)
    const match = normalized.match(/^team[ _]?(\d+)$/)
    if (!match) return result

    result[`team${match[1]}`] = header
    return result
  }, {})
}

function findTargetSheet(workbook) {
  if (!workbook.SheetNames?.length) {
    throw new Error('Excel file has no sheets.')
  }

  const match = workbook.SheetNames.find(
    (name) => normalizeHeader(name) === TARGET_SHEET,
  )

  if (!match) {
    throw new Error(
      `Sheet "${TARGET_SHEET}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`,
    )
  }

  return match
}

function parseRow(row, columnKeys, currentStory) {
  const rawStory = String(row[columnKeys.story] ?? '').trim()
  const story = rawStory || currentStory
  const character = String(row[columnKeys.character] ?? '').trim()
  const teams = Object.fromEntries(
    Object.entries(columnKeys.teamColumns).map(([teamKey, header]) => [
      teamKey,
      String(row[header] ?? '').trim(),
    ]),
  )

  return { story, character, ...teams }
}

function shouldSkipCharacter(character) {
  return SKIP_CHARACTERS.has(character.toLowerCase())
}

export function parseWorkbook(workbook) {
  const sheetName = findTargetSheet(workbook)
  const sheet = workbook.Sheets[sheetName]
  const rows = workbookToRows(sheet)

  if (rows.length === 0) {
    throw new Error('Excel sheet is empty.')
  }

  const headers = Object.keys(rows[0])
  const columnKeys = {
    story: findColumnKey(headers, COLUMN_MAP.story),
    character: findColumnKey(headers, COLUMN_MAP.character),
    teamColumns: getTeamColumnKeys(headers),
  }

  const missing = Object.entries(columnKeys)
    .filter(([name, key]) => name !== 'teamColumns' && !key)
    .map(([name]) => name)

  if (missing.length > 0 || Object.keys(columnKeys.teamColumns).length === 0) {
    const missingMessage = missing.length > 0 ? `Missing required columns: ${missing.join(', ')}.` : ''
    throw new Error(
      `${missingMessage} Expected Story, Character, and at least one Team column such as Team 1, Team 2, Team 3. `.trim(),
    )
  }

  const storyMap = new Map()
  let currentStory = ''

  for (const row of rows) {
    const parsed = parseRow(row, columnKeys, currentStory)
    if (parsed.story) {
      currentStory = parsed.story
    }
    if (!parsed.story || !parsed.character) continue
    if (shouldSkipCharacter(parsed.character)) continue

    if (!storyMap.has(parsed.story)) {
      storyMap.set(parsed.story, {
        title: parsed.story,
        characters: [],
      })
    }

    storyMap.get(parsed.story).characters.push(parsed)
  }

  const stories = Array.from(storyMap.values())

  if (stories.length === 0) {
    throw new Error('No valid story rows found in the Excel file.')
  }

  return {
    fileName: '',
    uploadedAt: new Date().toISOString(),
    stories,
    storyTitles: stories.map((story) => story.title),
  }
}

function workbookToRows(sheet) {
  return sheet.__rows || []
}

async function loadXlsx() {
  const module = await import('xlsx')
  return module.default || module
}

export async function parseExcelFile(file) {
  const XLSX = await loadXlsx()
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  workbook.Sheets[findTargetSheet(workbook)].__rows = XLSX.utils.sheet_to_json(
    workbook.Sheets[findTargetSheet(workbook)],
    { defval: '' },
  )
  const data = parseWorkbook(workbook)
  data.fileName = file.name
  return data
}

export async function parseExcelFromUrl(url) {
  const XLSX = await loadXlsx()
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to load sample Excel file.')
  }
  const buffer = await response.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  workbook.Sheets[findTargetSheet(workbook)].__rows = XLSX.utils.sheet_to_json(
    workbook.Sheets[findTargetSheet(workbook)],
    { defval: '' },
  )
  const data = parseWorkbook(workbook)
  data.fileName = 'sample-data.xlsx'
  return data
}
