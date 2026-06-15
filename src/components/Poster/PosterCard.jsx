import { formatPosterDate } from '../../lib/calendar'

function getFontSizes(lineCount) {
  if (lineCount > 10) return { meta: 17, cast: 16 }
  if (lineCount > 8) return { meta: 18, cast: 17 }
  if (lineCount > 6) return { meta: 19, cast: 18 }
  return { meta: 20, cast: 19 }
}

export default function PosterCard({ date, storyTitle, cast, av, fontSizeAdjust = 0 }) {
  const castLines = av
    ? [...cast, { character: 'AV', person: av }]
    : cast

  const sizes = getFontSizes(castLines.length)
  const cardStyle = {
    '--meta-size': `${sizes.meta + fontSizeAdjust}px`,
    '--cast-size': `${sizes.cast + fontSizeAdjust}px`,
  }

  return (
    <article className="poster-card" style={cardStyle}>
      <p className="poster-card-line">
        <span className="poster-label">Date:</span>{' '}
        <span className="poster-highlight">{formatPosterDate(date)}</span>
      </p>
      {storyTitle ? (
        <>
          <p className="poster-card-line poster-card-line--story">
            <span className="poster-label">Story:</span>{' '}
            <span className="poster-highlight">{storyTitle}</span>
          </p>
          <ul className="poster-cast-list">
            {castLines.map((item) => (
              <li key={item.character} className="poster-cast-item">
                <span className="poster-cast-character">{item.character}:</span>{' '}
                <span className="poster-cast-person">{item.person}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </article>
  )
}
