import { useState } from 'react'
import { dateKey, formatPosterDate } from '../lib/calendar'
import SundayCastEditor from './SundayCastEditor'

// Dynamically get all available teams from story characters
function getAvailableTeams(story) {
  if (!story || !story.characters) return []
  const teamKeys = new Set()
  story.characters.forEach((char) => {
    Object.keys(char).forEach((key) => {
      if (key.match(/^team\d+$/)) {
        teamKeys.add(key)
      }
    })
  })
  // Sort numerically: team1, team2, team3, etc.
  return Array.from(teamKeys).sort((a, b) => {
    const numA = parseInt(a.replace('team', ''))
    const numB = parseInt(b.replace('team', ''))
    return numA - numB
  })
}

// Get the currently selected team member based on selected team and overrides
function getCurrentPerson(char, selectedTeam, overrides) {
  return overrides[char.character] ?? (selectedTeam ? char[selectedTeam] : '') || ''
}

export default function ControlPanel({
  data,
  monthValue,
  setMonthValue,
  sundays,
  getSundaySlot,
  setStoryForSunday,
  setTeamForSunday,
  setOverrideForSunday,
  autoFillSundays,
  resetAssignments,
  onReplaceFile,
  onUpdateCharacter,
  customCharacters,
  setCustomCharacters,
  fontSizeAdjust,
  setFontSizeAdjust,
}) {
  const storyTitles = data.storyTitles
  const storyMap = new Map(data.stories.map((story) => [story.title, story]))
  const [expandedSunday, setExpandedSunday] = useState(null)
  const [newCharForm, setNewCharForm] = useState({}) // Track form input per sunday

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:rounded-xl sm:p-4">
        <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">Schedule Editor</h2>
            <p className="text-xs text-gray-600 sm:text-sm">
              Loaded: <span className="font-medium">{data.fileName}</span>
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 sm:px-3 sm:py-1.5"
            onClick={onReplaceFile}
          >
            Replace File
          </button>
        </div>

        <label className="mb-2 block text-xs font-medium text-gray-700 sm:mb-3 sm:text-sm">
          Month
          <input
            type="month"
            value={monthValue}
            min={'2026-01'}
            onChange={(event) => setMonthValue(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
          />
        </label>

        <label className="mb-2 block text-xs font-medium text-gray-700 sm:mb-3 sm:text-sm">
          Font Size Adjustment
          <div className="mt-1 flex items-center gap-2 sm:gap-3">
            <input
              type="range"
              min="-4"
              max="6"
              value={fontSizeAdjust}
              onChange={(event) => setFontSizeAdjust(Number(event.target.value))}
              className="flex-1"
            />
            <span className="w-8 rounded-lg border border-gray-300 px-1 py-1 text-center text-xs font-medium text-gray-700 sm:w-10 sm:px-2 sm:py-1.5">
              {fontSizeAdjust > 0 ? '+' : ''}{fontSizeAdjust}
            </span>
          </div>
        </label>

        <div className="mb-2 flex gap-2 sm:mb-3">
          <button
            type="button"
            className="flex-1 rounded-lg bg-gray-900 px-2 py-1.5 text-xs font-medium text-white hover:bg-gray-800 sm:flex-none sm:px-3"
            onClick={autoFillSundays}
          >
            Auto-fill
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 sm:flex-none sm:px-3"
            onClick={resetAssignments}
          >
            Clear
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Sunday Assignments</h3>
          {sundays.map((sunday) => {
            const key = dateKey(sunday)
            const slot = getSundaySlot(sunday)
            const story = slot.story ? storyMap.get(slot.story) : null
            const isExpanded = expandedSunday === key

            return (
              <div key={key} className="rounded-lg border border-gray-200 p-2.5 sm:p-3">
                <p className="mb-2 text-sm font-medium text-gray-800">
                  Sunday {formatPosterDate(sunday)}
                </p>

                <label className="mb-2 block text-xs text-gray-600">
                  Story
                  <select
                    value={slot.story}
                    onChange={(event) => setStoryForSunday(sunday, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="">— No story —</option>
                    {storyTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </label>

                {slot.story && (
                  <>
                    {(() => {
                      const availableTeams = getAvailableTeams(story)
                      return (
                        <label className="mb-2 block text-xs text-gray-600">
                          Team for this Sunday
                          <select
                            value={slot.team}
                            onChange={(event) => setTeamForSunday(sunday, event.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
                          >
                            {availableTeams.map((team) => (
                              <option key={team} value={team}>
                                {team.replace(/(\D+)(\d+)/g, '$1 $2')} {/* Converts team1 to "team 1" */}
                              </option>
                            ))}
                            <option value="merged">Merged Teams</option>
                          </select>
                        </label>
                      )
                    })()}

                    {story && (
                      <div className="mb-2 rounded-lg border border-blue-200 bg-blue-50 p-2">
                        <p className="mb-2 text-xs font-semibold text-blue-800">
                          Story Characters & Team Members
                        </p>
                        <div className="space-y-2 text-xs">
                          {story.characters.map((char) => {
                            const currentPerson = getCurrentPerson(char, slot.team, slot.overrides)
                            const teamMemberValue = slot.team !== 'merged' ? char[slot.team] : ''
                            return (
                              <div key={char.character} className="space-y-1 rounded bg-white p-1.5">
                                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                                  <span className="font-medium text-gray-800">{char.character}</span>
                                  <span className="text-gray-500">
                                    {teamMemberValue || '—'}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={currentPerson}
                                  onChange={(event) =>
                                    setOverrideForSunday(sunday, char.character, event.target.value)
                                  }
                                  placeholder="Enter team member name"
                                  className="w-full rounded border border-blue-300 px-2 py-1 text-xs"
                                />
                              </div>
                            )
                          })}

                          {customCharacters[key]?.map((customChar) => (
                            <div key={customChar.id} className="space-y-1 rounded border border-green-200 bg-green-50 p-1.5">
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <span className="font-medium text-gray-800">{customChar.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomCharacters((prev) => ({
                                      ...prev,
                                      [key]: prev[key].filter((c) => c.id !== customChar.id),
                                    }))
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                  ✕ Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                value={customChar.person}
                                onChange={(event) => {
                                  setCustomCharacters((prev) => ({
                                    ...prev,
                                    [key]: prev[key].map((c) =>
                                      c.id === customChar.id ? { ...c, person: event.target.value } : c
                                    ),
                                  }))
                                }}
                                placeholder="Enter team member name"
                                className="w-full rounded border border-green-300 px-2 py-1 text-xs"
                              />
                            </div>
                          ))}

                          {/* Add New Character Form */}
                          <div className="space-y-1 rounded border border-yellow-200 bg-yellow-50 p-1.5">
                            <p className="mb-1 text-xs font-semibold text-yellow-800">Add Custom Character</p>
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={newCharForm[key]?.charName || ''}
                                onChange={(event) => {
                                  setNewCharForm((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], charName: event.target.value },
                                  }))
                                }}
                                placeholder="Character name"
                                className="w-full rounded border border-yellow-300 px-2 py-1 text-xs"
                              />
                              <input
                                type="text"
                                value={newCharForm[key]?.personName || ''}
                                onChange={(event) => {
                                  setNewCharForm((prev) => ({
                                    ...prev,
                                    [key]: { ...prev[key], personName: event.target.value },
                                  }))
                                }}
                                placeholder="Team member name"
                                className="w-full rounded border border-yellow-300 px-2 py-1 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const charName = (newCharForm[key]?.charName?.trim() || 'AV')
                                  const personName = newCharForm[key]?.personName?.trim()
                                  if (personName) {
                                    setCustomCharacters((prev) => ({
                                      ...prev,
                                      [key]: [
                                        ...(prev[key] || []),
                                        { id: Date.now(), name: charName, person: personName },
                                      ],
                                    }))
                                    setNewCharForm((prev) => ({
                                      ...prev,
                                      [key]: { charName: '', personName: '' },
                                    }))
                                  }
                                }}
                                className="w-full rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700"
                              >
                                + Add Character
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedSunday(isExpanded ? null : key)}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      {isExpanded ? 'Hide cast editor' : 'Edit cast for this Sunday'}
                    </button>

                    {(isExpanded || slot.team === 'merged') && (
                      <SundayCastEditor
                        story={story}
                        team={slot.team}
                        overrides={slot.overrides}
                        onOverrideChange={(character, person) =>
                          setOverrideForSunday(sunday, character, person)
                        }
                      />
                    )}

                    {slot.team === 'merged' && !isExpanded && (
                      <p className="mt-1 text-xs text-orange-600">
                        Merged mode — open cast editor to assign characters from both teams.
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
