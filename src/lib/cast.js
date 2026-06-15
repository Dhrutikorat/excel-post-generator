function getTeamKeys(row) {
  return Object.keys(row)
    .filter((key) => /^team\d+$/.test(key))
    .sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))
}

function getFirstTeamValue(row) {
  const firstKey = getTeamKeys(row).find((key) => row[key])
  return firstKey ? row[firstKey] || '' : ''
}

export function getCastForStory(story, team, overrides = {}, customCharacters = []) {
  if (!story) return { cast: [], av: '' }

  const teamKey = team === 'merged' ? null : team
  const cast = []
  let av = ''

  for (const row of story.characters) {
    if (row.character.toLowerCase() === 'av') {
      av = overrides.AV ?? overrides.av ?? (teamKey ? row[teamKey] || '' : getFirstTeamValue(row))
      continue
    }

    const basePerson = teamKey
      ? row[teamKey] || ''
      : getFirstTeamValue(row)

    cast.push({
      character: row.character,
      person: overrides[row.character] ?? basePerson,
    })
  }

  // Add custom characters to cast
  if (customCharacters && customCharacters.length > 0) {
    customCharacters.forEach((customChar) => {
      cast.push({
        character: customChar.name,
        person: customChar.person,
      })
    })
  }

  return { cast, av }
}

export function buildDefaultOverrides(story, team) {
  if (!story || team !== 'merged') return {}

  const overrides = {}
  for (const row of story.characters) {
    if (row.character.toLowerCase() === 'av') {
      overrides.AV = getFirstTeamValue(row)
    } else {
      overrides[row.character] = getFirstTeamValue(row)
    }
  }
  return overrides
}
