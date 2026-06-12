import { useState } from 'react'
import { dateKey, formatPosterDate } from '../lib/calendar'
import SundayCastEditor from './SundayCastEditor'

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
}) {
  const storyTitles = data.storyTitles
  const storyMap = new Map(data.stories.map((story) => [story.title, story]))
  const [expandedSunday, setExpandedSunday] = useState(null)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Schedule Editor</h2>
            <p className="text-sm text-gray-600">
              Loaded: <span className="font-medium">{data.fileName}</span>
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            onClick={onReplaceFile}
          >
            Replace File
          </button>
        </div>

        <label className="mb-3 block text-sm font-medium text-gray-700">
          Month
          <input
            type="month"
            value={monthValue}
            onChange={(event) => setMonthValue(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
            onClick={autoFillSundays}
          >
            Auto-fill Sundays
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            onClick={resetAssignments}
          >
            Clear Assignments
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">Sunday Assignments</h3>
          {sundays.map((sunday) => {
            const key = dateKey(sunday)
            const slot = getSundaySlot(sunday)
            const story = slot.story ? storyMap.get(slot.story) : null
            const isExpanded = expandedSunday === key

            return (
              <div key={key} className="rounded-lg border border-gray-200 p-3">
                <p className="mb-2 text-sm font-medium text-gray-800">
                  Sunday {formatPosterDate(sunday)}
                </p>

                <label className="mb-2 block text-xs text-gray-600">
                  Story
                  <select
                    value={slot.story}
                    onChange={(event) => setStoryForSunday(sunday, event.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                    <label className="mb-2 block text-xs text-gray-600">
                      Team for this Sunday
                      <select
                        value={slot.team}
                        onChange={(event) => setTeamForSunday(sunday, event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="team1">Team 1</option>
                        <option value="team2">Team 2</option>
                        <option value="merged">Merged Teams</option>
                      </select>
                    </label>

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
