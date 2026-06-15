function getTeamKeys(stories) {
  const teamKeys = new Set()

  stories.forEach((story) => {
    story.characters.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (/^team\d+$/.test(key)) {
          teamKeys.add(key)
        }
      })
    })
  })

  return Array.from(teamKeys).sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
}

export default function DataPreview({ stories, onUpdateCharacter }) {
  if (!stories?.length) return null

  const teamKeys = getTeamKeys(stories)

  return (
    <details className="rounded-xl border border-gray-200 bg-white shadow-sm" open>
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">
        Edit Characters ({stories.length} stories)
      </summary>
      <p className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        Edit team names below. Changes are saved in your browser.
      </p>
      <div className="max-h-96 overflow-auto border-t border-gray-200">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-3 py-2">Story</th>
              <th className="px-3 py-2">Character</th>
              {teamKeys.map((teamKey) => (
                <th key={teamKey} className="px-3 py-2">
                  {teamKey.replace(/(\D+)(\d+)/, '$1 $2')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stories.flatMap((story) =>
              story.characters.map((row, index) => (
                <tr key={`${story.title}-${row.character}-${index}`} className="border-t border-gray-100">
                  <td className="px-3 py-1.5 font-medium text-gray-900">{story.title}</td>
                  <td className="px-3 py-1.5">{row.character}</td>
                  {teamKeys.map((teamKey) => (
                    <td key={teamKey} className="px-3 py-1.5">
                      <input
                        type="text"
                        value={row[teamKey] || ''}
                        onChange={(event) =>
                          onUpdateCharacter(story.title, row.character, { [teamKey]: event.target.value })
                        }
                        className="w-full min-w-20 rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    </td>
                  ))}
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </details>
  )
}
