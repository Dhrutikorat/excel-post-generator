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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Upload Excel File</h2>
      <p className="mb-4 text-sm text-gray-600">
        Upload once — data is saved in your browser. Expected columns: Story, Character, Team 1, Team 2.
      </p>

      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <p className="mb-3 text-sm text-gray-700">Drag and drop your .xlsx file here</p>
        <button
          type="button"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
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

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          disabled={loading}
          onClick={onLoadSample}
        >
          Load Sample Data
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
    </div>
  )
}
