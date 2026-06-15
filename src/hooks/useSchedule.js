import { useCallback, useEffect, useMemo, useState } from 'react'
import { dateKey, getSundaysInMonth } from '../lib/calendar'
import { buildDefaultOverrides } from '../lib/cast'
import { loadSchedule, saveSchedule } from '../lib/storage'

const DEFAULT_MONTH = '2026-06'
const EMPTY_SLOT = { story: '', team: 'team1', overrides: {} }

function getDefaultTeam(story) {
  if (!story?.characters?.length) return 'team1'

  const teamKeys = new Set()
  story.characters.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (/^team\d+$/.test(key)) {
        teamKeys.add(key)
      }
    })
  })

  return Array.from(teamKeys).sort((left, right) => Number(left.slice(4)) - Number(right.slice(4)))[0] || 'team1'
}

function normalizeSlot(value) {
  if (!value) return { ...EMPTY_SLOT }
  if (typeof value === 'string') {
    return { story: value, team: 'team1', overrides: {} }
  }
  return {
    story: value.story || '',
    team: value.team || 'team1',
    overrides: value.overrides || {},
  }
}

export function useSchedule(storyTitles, stories = []) {
  const saved = loadSchedule()
  const storyMap = useMemo(
    () => new Map(stories.map((story) => [story.title, story])),
    [stories],
  )

  const [monthValue, setMonthValue] = useState(saved?.monthValue || DEFAULT_MONTH)
  const [assignments, setAssignments] = useState(() => {
    const raw = saved?.assignments || {}
    const next = {}
    for (const [key, value] of Object.entries(raw)) {
      next[key] = normalizeSlot(value)
    }
    return next
  })

  const [year, month] = useMemo(() => {
    const [y, m] = monthValue.split('-').map(Number)
    return [y, m]
  }, [monthValue])

  const sundays = useMemo(() => getSundaysInMonth(year, month), [year, month])

  useEffect(() => {
    saveSchedule({ monthValue, assignments })
  }, [monthValue, assignments])

  useEffect(() => {
    setAssignments((prev) => {
      const validKeys = new Set(sundays.map(dateKey))
      const next = {}
      for (const [key, value] of Object.entries(prev)) {
        if (validKeys.has(key)) {
          next[key] = normalizeSlot(value)
        }
      }
      return next
    })
  }, [sundays])

  const updateSunday = useCallback((sunday, patch) => {
    const key = dateKey(sunday)
    setAssignments((prev) => {
      const current = normalizeSlot(prev[key])
      const next = { ...current, ...patch }

      if (patch.story !== undefined && patch.story !== current.story) {
        const story = storyMap.get(patch.story)
        next.team = patch.team || getDefaultTeam(story)
        next.overrides = patch.team === 'merged' || next.team === 'merged'
          ? buildDefaultOverrides(story, 'merged')
          : {}
      }

      if (patch.team === 'merged' && patch.team !== current.team) {
        const story = storyMap.get(next.story)
        next.overrides = buildDefaultOverrides(story, 'merged')
      }

      if (patch.team && patch.team !== 'merged' && current.team === 'merged') {
        next.overrides = {}
      }

      if (!next.story) {
        return { ...prev, [key]: { ...EMPTY_SLOT } }
      }

      return { ...prev, [key]: next }
    })
  }, [storyMap])

  const setStoryForSunday = useCallback((sunday, storyTitle) => {
    updateSunday(sunday, { story: storyTitle })
  }, [updateSunday])

  const setTeamForSunday = useCallback((sunday, team) => {
    updateSunday(sunday, { team })
  }, [updateSunday])

  const setOverrideForSunday = useCallback((sunday, character, person) => {
    const key = dateKey(sunday)
    setAssignments((prev) => {
      const current = normalizeSlot(prev[key])
      return {
        ...prev,
        [key]: {
          ...current,
          overrides: {
            ...current.overrides,
            [character]: person,
          },
        },
      }
    })
  }, [])

  const resetAssignments = useCallback(() => {
    setAssignments({})
  }, [])

  const autoFillSundays = useCallback(() => {
    const next = {}
    sundays.forEach((sunday, index) => {
      if (storyTitles[index]) {
        const story = storyMap.get(storyTitles[index])
        next[dateKey(sunday)] = {
          story: storyTitles[index],
          team: getDefaultTeam(story),
          overrides: {},
        }
      }
    })
    setAssignments(next)
  }, [storyMap, sundays, storyTitles])

  const getSundaySlot = useCallback((sunday) => {
    return normalizeSlot(assignments[dateKey(sunday)])
  }, [assignments])

  return {
    monthValue,
    setMonthValue,
    assignments,
    sundays,
    year,
    month,
    setStoryForSunday,
    setTeamForSunday,
    setOverrideForSunday,
    updateSunday,
    getSundaySlot,
    resetAssignments,
    autoFillSundays,
  }
}
