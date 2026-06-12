import { useState } from 'react'
import { capturePosterPng, downloadDataUrl, getExportFileName } from '../lib/exportImage'
import { EXPORT_PIXEL_RATIO, POSTER_HEIGHT, POSTER_WIDTH } from '../lib/posterSizes'

export default function ExportButton({ posterRef, fileName }) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  const outW = POSTER_WIDTH * EXPORT_PIXEL_RATIO
  const outH = POSTER_HEIGHT * EXPORT_PIXEL_RATIO

  const handleExport = async () => {
    if (!posterRef.current) return

    setExporting(true)
    setError('')

    try {
      const dataUrl = await capturePosterPng(posterRef.current)
      downloadDataUrl(dataUrl, getExportFileName(fileName))
    } catch (err) {
      setError(err.message || 'Failed to export poster.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {exporting ? 'Exporting...' : 'Download PNG'}
      </button>
      <p className="mt-2 text-xs text-gray-500">
        Sharp export {outW}×{outH} px ({EXPORT_PIXEL_RATIO}× resolution)
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
