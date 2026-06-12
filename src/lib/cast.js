export function getCastForStory(story, team, overrides = {}) {
  if (!story) return { cast: [], av: '' }

  const teamKey = team === 'team2' ? 'team2' : team === 'merged' ? null : 'team1'
  const cast = []
  let av = ''

  for (const row of story.characters) {
    if (row.character.toLowerCase() === 'av') {
      av = overrides.AV ?? overrides.av ?? (teamKey ? row[teamKey] : row.team1 || row.team2) || ''
      continue
    }

    const basePerson = teamKey
      ? row[teamKey] || ''
      : row.team1 || row.team2 || ''

    cast.push({
      character: row.character,
      person: overrides[row.character] ?? basePerson,
      team1: row.team1,
      team2: row.team2,
    })
  }

  return { cast, av }
}

export function buildDefaultOverrides(story, team) {
  if (!story || team !== 'merged') return {}

  const overrides = {}
  for (const row of story.characters) {
    if (row.character.toLowerCase() === 'av') {
      overrides.AV = row.team1 || row.team2 || ''
    } else {
      overrides[row.character] = row.team1 || row.team2 || ''
    }
  }
  return overrides
}
