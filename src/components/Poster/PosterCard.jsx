import { formatPosterDate } from '../../lib/calendar'

function getFontSizes(lineCount) {
  if (lineCount > 10) return { meta: 15, cast: 14 }
  if (lineCount > 8) return { meta: 16, cast: 15 }
  if (lineCount > 6) return { meta: 17, cast: 16 }
  return { meta: 18, cast: 17 }
}

export default function PosterCard({ date, storyTitle, cast, av }) {
  const castLines = av
    ? [...cast, { character: 'AV', person: av }]
    : cast

  const sizes = getFontSizes(castLines.length)
  const cardStyle = {
    '--meta-size': `${sizes.meta}px`,
    '--cast-size': `${sizes.cast}px`,
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
