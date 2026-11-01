import type { CSSProperties } from 'react'
import { useSiteInfo } from '../lib/siteInfo'

/**
 * The club's logo from Website Maintenance → Site Info. Without an uploaded logo it
 * falls back to the club's short name (or full name) as text — never a bundled image.
 */
export default function ClubLogo({
  height,
  color = '#0E1116',
  style,
}: {
  /** Logo height — px number or any CSS length (e.g. a clamp()). */
  height: number | string
  /** Text colour for the name fallback. */
  color?: string
  style?: CSSProperties
}) {
  const site = useSiteInfo()
  const h = typeof height === 'number' ? `${height}px` : height

  if (site.logo) {
    return (
      <img
        src={site.logo}
        alt={site.club_name || 'Club logo'}
        style={{ height: h, width: 'auto', objectFit: 'contain', display: 'block', ...style }}
      />
    )
  }

  const label = site.short_name || site.club_name
  if (!label) return null

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: h,
        fontFamily: 'CKCL',
        fontWeight: 700,
        fontSize: `calc(${h} * 0.62)`,
        letterSpacing: '0.04em',
        lineHeight: 1,
        color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </span>
  )
}
