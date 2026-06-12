export default function SundayCastEditor({
  story,
  team,
  overrides,
  onOverrideChange,
}) {
  if (!story) return null

  const castRows = story.characters.filter((row) => row.character.toLowerCase() !== 'av')
  const avRow = story.characters.find((row) => row.character.toLowerCase() === 'av')

  const getBasePerson = (row) => (team === 'team2' ? row.team2 : row.team1) || ''

  const getPerson = (row) => overrides[row.character] ?? getBasePerson(row)

  const getSelectValue = (row, person) => {
    if (person === row.team1 && row.team1) return 'team1'
    if (person === row.team2 && row.team2) return 'team2'
    return 'custom'
  }

  return (
    <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
      <p className="mb-2 text-xs font-semibold text-orange-800">
        {team === 'merged'
          ? 'Merged teams — pick from Team 1, Team 2, or enter a custom name'
          : 'Customize cast for this Sunday only'}
      </p>
      <div className="space-y-2">
        {castRows.map((row) => {
          const person = getPerson(row)
          const selectValue = team === 'merged' ? getSelectValue(row, person) : null

          return (
            <div key={row.character} className="grid grid-cols-[1fr_1fr] gap-2 text-xs">
              <span className="self-center font-medium text-gray-800">{row.character}</span>
              {team === 'merged' ? (
                <div className="flex flex-col gap-1">
                  <select
                    value={selectValue}
                    onChange={(event) => {
                      const choice = event.target.value
                      if (choice === 'team1') onOverrideChange(row.character, row.team1)
                      else if (choice === 'team2') onOverrideChange(row.character, row.team2)
                      else onOverrideChange(row.character, person || '')
                    }}
                    className="rounded border border-gray-300 px-2 py-1"
                  >
                    <option value="team1">Team 1: {row.team1 || '—'}</option>
                    <option value="team2">Team 2: {row.team2 || '—'}</option>
                    <option value="custom">Custom name</option>
                  </select>
                  {selectValue === 'custom' && (
                    <input
                      type="text"
                      value={person}
                      onChange={(event) => onOverrideChange(row.character, event.target.value)}
                      placeholder="Enter name"
                      className="rounded border border-gray-300 px-2 py-1"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={person}
                  onChange={(event) => onOverrideChange(row.character, event.target.value)}
                  className="rounded border border-gray-300 px-2 py-1"
                />
              )}
            </div>
          )
        })}

        {avRow && (
          <div className="grid grid-cols-[1fr_1fr] gap-2 text-xs">
            <span className="self-center font-medium text-gray-800">AV</span>
            <input
              type="text"
              value={overrides.AV ?? getBasePerson(avRow)}
              onChange={(event) => onOverrideChange('AV', event.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            />
          </div>
        )}
      </div>
    </div>
  )
}
