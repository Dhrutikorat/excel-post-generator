import { forwardRef } from 'react'
import { dateKey, getMonthLabel } from '../../lib/calendar'
import { getCastForStory } from '../../lib/cast'
import PosterCard from './PosterCard'
import './poster.css'

function normalizeSlot(value) {
  if (!value) return { story: '', team: 'team1', overrides: {} }
  if (typeof value === 'string') {
    return { story: value, team: 'team1', overrides: {} }
  }
  return {
    story: value.story || '',
    team: value.team || 'team1',
    overrides: value.overrides || {},
  }
}

const Poster = forwardRef(function Poster({ year, month, sundays, assignments, stories }, ref) {
  const monthLabel = getMonthLabel(year, month)
  const storyMap = new Map(stories.map((story) => [story.title, story]))
  const gridClass = sundays.length > 4 ? 'poster-grid poster-grid--5' : 'poster-grid'

  return (
    <div ref={ref} className="poster-root">
      <div className="poster-bg-shape poster-bg-shape--peach-tl" />
      <div className="poster-bg-shape poster-bg-shape--tan-tr" />
      <div className="poster-bg-shape poster-bg-shape--mustard-bl" />
      <div className="poster-bg-dots" />

      <div className="poster-content">
        <h1 className="poster-month">{monthLabel}</h1>
        <div className={gridClass}>
          {sundays.map((sunday) => {
            const key = dateKey(sunday)
            const slot = normalizeSlot(assignments[key])
            const story = slot.story ? storyMap.get(slot.story) : null
            const { cast, av } = getCastForStory(story, slot.team, slot.overrides)

            return (
              <PosterCard
                key={key}
                date={sunday}
                storyTitle={slot.story}
                cast={cast}
                av={av}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default Poster
