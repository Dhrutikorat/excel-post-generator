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

export default function App() {
  const posterRef = useRef(null)
  const [customCharacters, setCustomCharacters] = useState(() => loadCustomCharacters() || {})
  const [fontSizeAdjust, setFontSizeAdjust] = useState(0)
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

  const posterProps = {
    year,
    month,
    sundays,
    assignments,
    stories: data?.stories || [],
    customCharacters,
    fontSizeAdjust,
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
                autoFillSundays={autoFillSundays}
                resetAssignments={resetAssignments}
                onReplaceFile={handleReplaceFile}
                customCharacters={customCharacters}
                setCustomCharacters={setCustomCharacters}
                fontSizeAdjust={fontSizeAdjust}
                setFontSizeAdjust={setFontSizeAdjust}
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
