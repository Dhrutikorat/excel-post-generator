import { useRef, useState } from 'react'

export default function FileUpload({ onUpload, onLoadSample, loading, error }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file) return
    await onUpload(file)
  }

  const onDrop = async (event) => {
    event.preventDefault()
    setDragOver(false)
    await handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Upload Excel File</h2>
      <p className="mb-4 text-xs text-gray-600 sm:text-sm">
        Upload once — data is saved in your browser. Expected columns: Story, Character, and one or more Team columns such as Team 1, Team 2, Team 3, etc...
      </p>

      <div
        className={`rounded-lg border-2 border-dashed p-5 text-center transition-colors sm:p-8 ${
          dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <p className="mb-3 text-xs text-gray-700 sm:text-sm">Drag and drop your .xlsx file here</p>
        <button
          type="button"
          className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600 disabled:opacity-50 sm:px-4 sm:text-sm"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? 'Processing...' : 'Choose File'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 sm:w-auto sm:px-4 sm:text-sm"
          disabled={loading}
          onClick={onLoadSample}
        >
          Load Sample Data
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">{error}</p>
      )}
    </div>
  )
}
