export default function SundayCastEditor({
  story,
  team,
  overrides,
  onOverrideChange,
}) {
  if (!story) return null

  const castRows = story.characters.filter((row) => row.character.toLowerCase() !== 'av')
  const avRow = story.characters.find((row) => row.character.toLowerCase() === 'av')

  // Dynamically get all available teams from story
  const getAvailableTeams = () => {
    if (!story || !story.characters) return []
    const teamKeys = new Set()
    story.characters.forEach((char) => {
      Object.keys(char).forEach((key) => {
        if (key.match(/^team\d+$/)) {
          teamKeys.add(key)
        }
      })
    })
    return Array.from(teamKeys).sort((a, b) => {
      const numA = parseInt(a.replace('team', ''))
      const numB = parseInt(b.replace('team', ''))
      return numA - numB
    })
  }

  const availableTeams = getAvailableTeams()

  // Get the base person for the selected team (not from overrides)
  const getBasePerson = (row) => (team && team !== 'merged' ? row[team] : '') || ''

  const getPerson = (row) => overrides[row.character] ?? getBasePerson(row)

  // Get select value by checking which team the person belongs to
  const getSelectValue = (row, person) => {
    for (const teamKey of availableTeams) {
      if (person === row[teamKey] && row[teamKey]) return teamKey
    }
    return 'custom'
  }

  return (
    <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 p-2.5 sm:p-3">
      <p className="mb-2 text-xs font-semibold text-orange-800">
        {team === 'merged'
          ? `Merged teams — pick from ${availableTeams.map((t) => t.replace(/(\D+)(\d+)/g, '$1 $2')).join(', ')}, or enter a custom name`
          : 'Customize cast for this Sunday only'}
      </p>
      <div className="space-y-2">
        {castRows.map((row) => {
          const person = getPerson(row)
          const selectValue = team === 'merged' ? getSelectValue(row, person) : null
          const teamDisplay = availableTeams.map((t) => row[t] || '—').join(' / ')

          return (
            <div key={row.character} className="space-y-1">
              <div className="grid gap-1 text-xs sm:grid-cols-[1fr_2fr] sm:gap-2">
                <span className="self-center font-medium text-gray-800">{row.character}</span>
                <span className="self-center text-gray-600">{teamDisplay}</span>
              </div>
              <div className="grid gap-1 text-xs sm:grid-cols-[1fr_2fr] sm:gap-2">
                <div className="hidden sm:block" />
                {team === 'merged' ? (
                <div className="flex flex-col gap-1">
                  <select
                    value={selectValue}
                    onChange={(event) => {
                      const choice = event.target.value
                      if (availableTeams.includes(choice)) {
                        onOverrideChange(row.character, row[choice])
                      } else if (choice === 'custom') {
                        onOverrideChange(row.character, person || '')
                      }
                    }}
                    className="rounded border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                  >
                    {availableTeams.map((teamKey) => (
                      <option key={teamKey} value={teamKey}>
                        {teamKey.replace(/(\D+)(\d+)/g, '$1 $2')}: {row[teamKey] || '—'}
                      </option>
                    ))}
                    <option value="custom">Custom name</option>
                  </select>
                  {selectValue === 'custom' && (
                    <input
                      type="text"
                      value={person}
                      onChange={(event) => onOverrideChange(row.character, event.target.value)}
                      placeholder="Enter name"
                      className="rounded border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={person}
                  onChange={(event) => onOverrideChange(row.character, event.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                />
              )}
              </div>
            </div>
          )
        })}

        {avRow && (
          <div className="space-y-1">
            <div className="grid gap-1 text-xs sm:grid-cols-[1fr_2fr] sm:gap-2">
              <span className="self-center font-medium text-gray-800">AV</span>
              <span className="self-center text-gray-600">
                {availableTeams.map((t) => avRow[t] || '—').join(' / ')}
              </span>
            </div>
            <div className="grid gap-1 text-xs sm:grid-cols-[1fr_2fr] sm:gap-2">
              <div className="hidden sm:block" />
              <input
                type="text"
                value={overrides.AV ?? getBasePerson(avRow)}
                onChange={(event) => onOverrideChange('AV', event.target.value)}
                className="rounded border border-gray-300 px-2 py-1 text-xs sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
