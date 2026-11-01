import type { CSSProperties } from 'react'

/** First letter of the name, upper-cased ("rahim uddin" → "R"). */
export function nameInitial(name: string | null | undefined): string {
  const first = String(name || '').trim().split(/\s+/)[0] || ''
  return first.charAt(0).toUpperCase()
}

/**
 * A person's photo from the API, or — when there is none — the first letter of the
 * name on a plain club-coloured panel. Never a stock photo of someone else.
 * Fills its parent (width/height 100%), like the <img> it replaces.
 */
export default function PersonPortrait({
  src,
  name,
  className,
  style,
  initialSize = 'clamp(40px, 9vw, 72px)',
  captionOverlay = true,
}: {
  src?: string | null
  name: string
  className?: string
  style?: CSSProperties
  /** Font size of the initial — smaller for avatars. */
  initialSize?: string
  /** Lift the initial above a name overlay at the bottom (cards); off for avatars. */
  captionOverlay?: boolean
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', ...style }}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Text sits slightly above centre so the name overlay at the bottom never covers it
        paddingBottom: captionOverlay ? '18%' : 0,
        background: 'linear-gradient(160deg, #2A3039 0%, #0E1116 100%)',
        ...style,
      }}
    >
      <span style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: initialSize, lineHeight: 1, color: '#E8C584' }}>
        {nameInitial(name)}
      </span>
    </div>
  )
}
