import { forwardRef } from 'react'
import { dateKey, getMonthLabel } from '../../lib/calendar'
import { getCastForStory } from '../../lib/cast'
import PosterCard from './PosterCard'
import './poster.css'

function normalizeSlot(value) {
  if (!value) return { story: '', team: 'team1', overrides: {}, reason: '' }
  if (typeof value === 'string') {
    return { story: value, team: 'team1', overrides: {}, reason: '' }
  }
  return {
    story: value.story || '',
    team: value.team || 'team1',
    overrides: value.overrides || {},
    reason: value.reason || '',
  }
}

const Poster = forwardRef(function Poster({ year, month, sundays, assignments, stories, customCharacters = {}, fontSizeAdjust = 0, theme = {} }, ref) {
  const monthLabel = getMonthLabel(year, month)
  const storyMap = new Map(stories.map((story) => [story.title, story]))
  const gridClass = sundays.length > 4 ? 'poster-grid poster-grid--5' : 'poster-grid'

  const themeStyle = {
    '--poster-bg': theme.background || '#faf8f5',
    '--poster-month': theme.month || '#f0b8a0',
    '--poster-accent': theme.accent || '#e8a830',
    '--poster-shape1': theme.shape1 || '#f5c4a8',
    '--poster-shape2': theme.shape2 || '#e8d4b8',
    '--poster-shape3': theme.shape3 || '#e6c76b',
    '--poster-dot': theme.dot || '#d4a82a',
    '--poster-card': theme.card || 'rgba(255, 255, 255, 0.35)',
  }

  return (
    <div ref={ref} className="poster-root" style={themeStyle}>
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
            const { cast, av } = getCastForStory(story, slot.team, slot.overrides, customCharacters[key])

            return (
              <PosterCard
                key={key}
                date={sunday}
                storyTitle={slot.story}
                reason={slot.reason}
                cast={cast}
                av={av}
                fontSizeAdjust={fontSizeAdjust}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default Poster
