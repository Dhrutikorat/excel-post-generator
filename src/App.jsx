import { useRef } from 'react'
import ControlPanel from './components/ControlPanel'
import ExportButton from './components/ExportButton'
import FileUpload from './components/FileUpload'
import Poster from './components/Poster/Poster'
import { getMonthLabel } from './lib/calendar'
import { POSTER_HEIGHT, POSTER_WIDTH } from './lib/posterSizes'
import { useExcelData } from './hooks/useExcelData'
import { useSchedule } from './hooks/useSchedule'

export default function App() {
  const posterRef = useRef(null)
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
  }

  const exportFileName = `${getMonthLabel(year, month)}_${year}_schedule.png`

  const posterProps = {
    year,
    month,
    sundays,
    assignments,
    stories: data?.stories || [],
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Excel Poster Generator</h1>
        <p className="text-sm text-gray-600">
          A4 portrait poster — scroll preview to read text at full size.
        </p>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-6 p-6 xl:grid-cols-[400px_1fr]">
        <section className="space-y-4">
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
              />
              <ExportButton posterRef={posterRef} fileName={exportFileName} />
            </>
          )}
        </section>

        {data && (
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">Poster Preview</h2>
            <p className="mb-3 text-xs text-gray-500">
              Full {POSTER_WIDTH}×{POSTER_HEIGHT} px preview — scroll to zoom in. Export is 2× resolution for sharp text.
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
