import { useEffect, useRef, useState } from 'react'
import ControlPanel from './components/ControlPanel'
import ExportButton from './components/ExportButton'
import FileUpload from './components/FileUpload'
import Poster from './components/Poster/Poster'
import { getMonthLabel } from './lib/calendar'
import { POSTER_HEIGHT, POSTER_WIDTH } from './lib/posterSizes'
import { useExcelData } from './hooks/useExcelData'
import { useSchedule } from './hooks/useSchedule'
import { loadCustomCharacters, saveCustomCharacters } from './lib/storage'

const POSTER_THEMES = [
  { id: 'classic', label: 'Classic Cream', background: '#faf8f5', month: '#f0b8a0', accent: '#e8a830', shape1: '#f5c4a8', shape2: '#e8d4b8', shape3: '#e6c76b', dot: '#d4a82a', card: 'rgba(255, 255, 255, 0.35)' },
  { id: 'ocean', label: 'Ocean Blue', background: '#edf7ff', month: '#3b82c4', accent: '#0f766e', shape1: '#bfe0ff', shape2: '#d7ebff', shape3: '#8ecae6', dot: '#4f81b7', card: 'rgba(255, 255, 255, 0.45)' },
  { id: 'forest', label: 'Forest Green', background: '#f1f9f2', month: '#3a7d5d', accent: '#b76e1a', shape1: '#cfe8c7', shape2: '#dceec7', shape3: '#a7c896', dot: '#6e8f5e', card: 'rgba(255, 255, 255, 0.4)' },
  { id: 'sunset', label: 'Sunset Peach', background: '#fff3ef', month: '#d97706', accent: '#a16207', shape1: '#f9c7b8', shape2: '#f4d7c3', shape3: '#f4c95d', dot: '#d97706', card: 'rgba(255, 255, 255, 0.4)' },
]

export default function App() {
  const posterRef = useRef(null)
  const [customCharacters, setCustomCharacters] = useState(() => loadCustomCharacters() || {})
  const [fontSizeAdjust, setFontSizeAdjust] = useState(0)
  const [posterTheme, setPosterTheme] = useState('classic')
  const [customPosterColor, setCustomPosterColor] = useState('#f5f0e8')
  const { data, loading, error, uploadFile, loadSample, replaceData, updateCharacter } = useExcelData()

  const schedule = useSchedule(data?.storyTitles || [], data?.stories || [])
  const {
    monthValue,
    setMonthValue,
    sundays,
    assignments,
    year,
    month,
    setStoryForSunday,
    setTeamForSunday,
    setOverrideForSunday,
    setReasonForSunday,
    getSundaySlot,
    autoFillSundays,
    resetAssignments,
  } = schedule

  const handleReplaceFile = () => {
    replaceData()
    resetAssignments()
    setCustomCharacters({})
  }

  useEffect(() => {
    saveCustomCharacters(customCharacters)
  }, [customCharacters])

  const exportFileName = `${getMonthLabel(year, month)}_${year}_schedule.png`

  const activePosterTheme = posterTheme === 'custom'
    ? {
        id: 'custom',
        label: 'Custom Color',
        background: customPosterColor,
        month: '#5b3f2a',
        accent: '#a16207',
        shape1: '#f7d7bb',
        shape2: '#f5ead9',
        shape3: '#e6c76b',
        dot: '#a16207',
        card: 'rgba(255, 255, 255, 0.35)',
      }
    : POSTER_THEMES.find((theme) => theme.id === posterTheme) || POSTER_THEMES[0]

  const posterProps = {
    year,
    month,
    sundays,
    assignments,
    stories: data?.stories || [],
    customCharacters,
    fontSizeAdjust,
    theme: activePosterTheme,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-3 py-3 shadow-sm sm:px-6 sm:py-4">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Puppet Image Generator</h1>
      </header>

      <main className="mx-auto grid max-w-350 gap-3 p-3 sm:gap-6 sm:p-6 xl:grid-cols-[400px_minmax(0,1fr)]">
        <section className="order-1 min-w-0 space-y-3 sm:space-y-4">
          {!data ? (
            <FileUpload
              onUpload={uploadFile}
              onLoadSample={loadSample}
              loading={loading}
              error={error}
            />
          ) : (
            <>
              <ControlPanel
                data={data}
                monthValue={monthValue}
                setMonthValue={setMonthValue}
                sundays={sundays}
                getSundaySlot={getSundaySlot}
                setStoryForSunday={setStoryForSunday}
                setTeamForSunday={setTeamForSunday}
                setOverrideForSunday={setOverrideForSunday}
                setReasonForSunday={setReasonForSunday}
                autoFillSundays={autoFillSundays}
                resetAssignments={resetAssignments}
                onReplaceFile={handleReplaceFile}
                customCharacters={customCharacters}
                setCustomCharacters={setCustomCharacters}
                fontSizeAdjust={fontSizeAdjust}
                setFontSizeAdjust={setFontSizeAdjust}
                posterThemes={POSTER_THEMES}
                posterTheme={posterTheme}
                setPosterTheme={setPosterTheme}
                customPosterColor={customPosterColor}
                setCustomPosterColor={setCustomPosterColor}
              />
              <ExportButton posterRef={posterRef} fileName={exportFileName} />
            </>
          )}
        </section>

        {data && (
          <section className="order-2 min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <h2 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Poster Preview</h2>
            <p className="mb-3 text-xs text-gray-500">
              {POSTER_WIDTH}×{POSTER_HEIGHT}px — scroll to zoom
            </p>

            <div aria-hidden="true" className="poster-export-layer">
              <Poster ref={posterRef} {...posterProps} />
            </div>

            <div className="poster-preview-scroll">
              <div className="poster-preview-wrap">
                <Poster {...posterProps} />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
