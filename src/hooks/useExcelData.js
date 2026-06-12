import { useCallback, useEffect, useState } from 'react'
import { parseExcelFile, parseExcelFromUrl } from '../lib/parseExcel'
import { clearExcelData, loadExcelData, saveExcelData } from '../lib/storage'

export function useExcelData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = loadExcelData()
    if (saved) {
      setData(saved)
    }
  }, [])

  const persistData = useCallback((next) => {
    saveExcelData(next)
    setData(next)
    setError('')
  }, [])

  const handleParsedData = useCallback((parsed) => {
    persistData(parsed)
  }, [persistData])

  const uploadFile = useCallback(async (file) => {
    setLoading(true)
    setError('')
    try {
      const parsed = await parseExcelFile(file)
      handleParsedData(parsed)
      return parsed
    } catch (err) {
      setError(err.message || 'Failed to parse Excel file.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [handleParsedData])

  const loadSample = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.BASE_URL
      const parsed = await parseExcelFromUrl(`${base}sample-data.xlsx`)
      handleParsedData(parsed)
      return parsed
    } catch (err) {
      setError(err.message || 'Failed to load sample data.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [handleParsedData])

  const replaceData = useCallback(() => {
    clearExcelData()
    setData(null)
    setError('')
  }, [])

  const updateCharacter = useCallback((storyTitle, character, updates) => {
    setData((prev) => {
      if (!prev) return prev

      const stories = prev.stories.map((story) => {
        if (story.title !== storyTitle) return story

        return {
          ...story,
          characters: story.characters.map((row) => {
            if (row.character !== character) return row
            return { ...row, ...updates }
          }),
        }
      })

      const next = { ...prev, stories }
      saveExcelData(next)
      return next
    })
  }, [])

  return {
    data,
    loading,
    error,
    uploadFile,
    loadSample,
    replaceData,
    updateCharacter,
    setError,
  }
}
