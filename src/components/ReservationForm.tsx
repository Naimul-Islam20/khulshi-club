import { useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import { useMemberSession } from '../lib/memberSession'
import { useSiteInfo } from '../lib/siteInfo'

// Facility reservation request → POST /api/facilities/{slug}/reservations.
// Members only: signed-in session supplies member_id — guests are asked to sign in.

type BookingConfig = { enabled: boolean; time_slots: string[]; max_guests: number }
type Reservation = { reference: string; facility: string; date: string; time_slot: string; guests: number }

const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const prettyDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

const label: React.CSSProperties = { display: 'block', fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116', marginBottom: 6 }
const field = (invalid: boolean): React.CSSProperties => ({
  width: '100%', boxSizing: 'border-box', fontFamily: 'CKCL', fontSize: 14, color: '#0E1116',
  background: '#F7F8FA', border: `1px solid ${invalid ? '#F87171' : '#E2E6EC'}`, borderRadius: 10, padding: '10px 13px', outline: 'none',
})
const errorText: React.CSSProperties = { fontFamily: 'CKCL', fontSize: 12, color: '#DC2626', marginTop: 5 }
const stepBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: '50%', border: '1px solid #E2E6EC', background: '#FFF', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#0E1116',
}

export default function ReservationForm({
  facilityId,
  onSignIn,
}: {
  facilityId: string
  onSignIn?: () => void
}) {
  const site = useSiteInfo()
  const { session, memberNo } = useMemberSession()
  const [config, setConfig] = useState<BookingConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState('')
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState<string | null>(null)
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState<Reservation | null>(null)

  useEffect(() => {
    let alive = true
    setConfigLoading(true)
    setConfigError('')
    api<{ facility: { booking?: BookingConfig } }>(`/facilities/${facilityId}`)
      .then((d) => {
        if (!alive) return
        const booking = d.facility?.booking
        if (booking && Array.isArray(booking.time_slots)) {
          setConfig({
            enabled: Boolean(booking.enabled),
            time_slots: booking.time_slots,
            max_guests: Number(booking.max_guests) || 1,
          })
        } else {
          setConfig(null)
          setConfigError('Booking times are not configured for this facility.')
        }
      })
      .catch((e: Error) => {
        if (!alive) return
        setConfig(null)
        setConfigError(e.message || 'Could not load booking options.')
      })
      .finally(() => { if (alive) setConfigLoading(false) })
    return () => { alive = false }
  }, [facilityId])

  useEffect(() => {
    if (!config) return
    setGuests((g) => Math.min(g, config.max_guests || 1))
  }, [config])

  // Prefill contact from the signed-in member — no manual Member ID field.
  useEffect(() => {
    if (!session) return
    setName((n) => n || session.name || '')
    setPhone((p) => p || session.phone || '')
  }, [session])

  const clear = (key: string) => setErrors((e) => { const { [key]: _, ...rest } = e; return rest })

  const submit = async () => {
    if (!memberNo) {
      setFormError('Sign in with your membership to request a booking.')
      return
    }
    const local: Record<string, string> = {}
    if (!date) local.date = 'Choose a date.'
    if (!slot) local.time_slot = 'Choose a time slot.'
    if (!name.trim()) local.name = 'Enter your name.'
    if (!phone.trim()) local.phone = 'Enter a phone number so the club can call you.'
    setErrors(local)
    setFormError('')
    if (Object.keys(local).length) return

    setBusy(true)
    try {
      const res = await api<{ reservation: Reservation }>(`/facilities/${facilityId}/reservations`, {
        method: 'POST',
        body: JSON.stringify({
          date, time_slot: slot, guests,
          name: name.trim(), phone: phone.trim(),
          member_id: memberNo,
          note: note.trim() || null,
        }),
      })
      setDone(res.reservation)
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.errors).length) {
        setErrors(Object.fromEntries(Object.entries(e.errors).map(([k, v]) => [k, v[0]])))
      } else {
        setFormError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setDone(null); setDate(''); setSlot(null); setGuests(1); setNote(''); setShowNote(false); setErrors({})
  }

  if (configLoading) {
    return (
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: '#5C6673', lineHeight: 1.6, padding: '8px 0' }}>
        Loading booking options…
      </div>
    )
  }

  if (!config || configError) {
    return (
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: '#5C6673', lineHeight: 1.6, padding: '8px 0' }}>
        {configError || 'Booking options are not available.'}{' '}
        {site.contact.phone && (
          <>
            Call the club office at{' '}
            <a href={site.contact.phone_href ?? undefined} style={{ color: '#E10B17', fontWeight: 600, textDecoration: 'none' }}>{site.contact.phone}</a>.
          </>
        )}
      </div>
    )
  }

  if (!config.enabled) {
    return (
      <div style={{ fontFamily: 'CKCL', fontSize: 14, color: '#5C6673', lineHeight: 1.6, padding: '8px 0' }}>
        Online reservations aren't available for this facility. Please call the club office at{' '}
        <a href={site.contact.phone_href ?? undefined} style={{ color: '#E10B17', fontWeight: 600, textDecoration: 'none' }}>{site.contact.phone}</a>.
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4" style={{ textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div style={{ fontFamily: 'CKCL', fontWeight: 600, fontSize: 18, color: '#0E1116' }}>Request received!</div>
        <div style={{ fontFamily: 'CKCL', fontSize: 13, color: '#5C6673', lineHeight: 1.55 }}>
          {done.facility} · {prettyDate(done.date)} · {done.time_slot} · {done.guests} {done.guests > 1 ? 'guests' : 'guest'}
        </div>
        <div style={{ fontFamily: 'CKCL', fontSize: 12, color: '#5C6673', background: '#F7F8FA', border: '1px solid #E2E6EC', borderRadius: 10, padding: '8px 14px' }}>
          Reference <strong style={{ color: '#0E1116', letterSpacing: '0.04em' }}>{done.reference}</strong>
        </div>
        <div style={{ fontFamily: 'CKCL', fontSize: 13, color: '#5C6673' }}>The club will call you to confirm within one business day.</div>
        <button type="button" onClick={reset} style={{ fontFamily: 'CKCL', fontSize: 13, color: '#E10B17', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}>
          Make another booking
        </button>
      </div>
    )
  }

  // Guests / signed-out members: don't ask for a Member ID they may not know — send them to login.
  if (!memberNo) {
    return (
      <div style={{ padding: '4px 0 2px' }}>
        <div style={{ fontFamily: 'CKCL', fontSize: 14, color: '#5C6673', lineHeight: 1.6, marginBottom: 16 }}>
          Facility bookings are for members. Sign in with your membership — we&apos;ll use your account, so you won&apos;t need to type a Member ID.
        </div>
        {onSignIn && (
          <button
            type="button"
            onClick={onSignIn}
            style={{ width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: '#FFF', background: '#E10B17', border: 'none', borderRadius: 999, cursor: 'pointer', marginBottom: 12 }}
          >
            Sign in to reserve
          </button>
        )}
        <div style={{ fontFamily: 'CKCL', fontSize: 13, color: '#5C6673', lineHeight: 1.55, textAlign: 'center' }}>
          Not a member?{' '}
          <a href={site.contact.phone_href ?? undefined} style={{ color: '#E10B17', fontWeight: 600, textDecoration: 'none' }}>
            Call the club office
          </a>
          {site.contact.phone ? ` · ${site.contact.phone}` : ''}
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          padding: '10px 12px', borderRadius: 12, background: '#FFF1F2', border: '1px solid #FFE4E6',
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E10B17', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, fontWeight: 600, color: '#0E1116' }}>
            Booking as {memberNo}
          </div>
          <div style={{ fontFamily: 'CKCL', fontSize: 12, color: '#5C6673', marginTop: 1 }}>
            Member ID comes from your signed-in account.
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={label} htmlFor={`rsv-date-${facilityId}`}>Date</label>
        <input
          id={`rsv-date-${facilityId}`}
          type="date"
          min={today()}
          value={date}
          onChange={(e) => { setDate(e.target.value); clear('date') }}
          style={field(!!errors.date)}
        />
        {errors.date && <div style={errorText}>{errors.date}</div>}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={label}>Time Slot</div>
        <div className="flex flex-wrap gap-2">
          {config.time_slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setSlot(slot === s ? null : s); clear('time_slot') }}
              style={{
                fontFamily: 'CKCL', fontSize: 12, fontWeight: 500,
                color: slot === s ? '#FFF' : '#2A3039',
                background: slot === s ? '#E10B17' : '#F7F8FA',
                border: `1px solid ${slot === s ? '#E10B17' : errors.time_slot ? '#F87171' : '#E2E6EC'}`,
                borderRadius: 999, padding: '6px 12px', cursor: 'pointer', transition: 'all 160ms',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.time_slot && <div style={errorText}>{errors.time_slot}</div>}
      </div>

      <div className="flex items-center justify-between" style={{ padding: '10px 14px', background: '#F7F8FA', borderRadius: 12, marginBottom: errors.guests ? 4 : 14 }}>
        <span style={{ fontFamily: 'CKCL', fontSize: 13, fontWeight: 600, color: '#0E1116' }}>Guests</span>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} style={stepBtn}>−</button>
          <span style={{ fontFamily: 'CKCL', fontWeight: 500, fontSize: 14, color: '#0E1116', minWidth: 18, textAlign: 'center' }}>{guests}</span>
          <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(config.max_guests || 1, g + 1))} style={stepBtn}>+</button>
        </div>
      </div>
      {errors.guests && <div style={{ ...errorText, marginBottom: 14 }}>{errors.guests}</div>}

      <div style={{ marginBottom: 12 }}>
        <label style={label} htmlFor={`rsv-name-${facilityId}`}>Your name</label>
        <input id={`rsv-name-${facilityId}`} value={name} onChange={(e) => { setName(e.target.value); clear('name') }} autoComplete="name" maxLength={120} placeholder="Full name" style={field(!!errors.name)} />
        {errors.name && <div style={errorText}>{errors.name}</div>}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={label} htmlFor={`rsv-phone-${facilityId}`}>Phone</label>
        <input id={`rsv-phone-${facilityId}`} value={phone} onChange={(e) => { setPhone(e.target.value); clear('phone') }} type="tel" autoComplete="tel" maxLength={32} placeholder="01XXXXXXXXX" style={field(!!errors.phone)} />
        {errors.phone && <div style={errorText}>{errors.phone}</div>}
      </div>

      {showNote ? (
        <div style={{ marginBottom: 14 }}>
          <label style={label} htmlFor={`rsv-note-${facilityId}`}>Note for the club</label>
          <textarea id={`rsv-note-${facilityId}`} value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} placeholder="Anything we should know?" style={{ ...field(false), resize: 'vertical' }} />
        </div>
      ) : (
        <button type="button" onClick={() => setShowNote(true)} style={{ fontFamily: 'CKCL', fontSize: 12.5, color: '#5C6673', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}>
          + Add a note
        </button>
      )}

      {formError && (
        <div style={{ fontFamily: 'CKCL', fontSize: 13, color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '9px 12px', marginBottom: 12 }}>
          {formError}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        style={{ width: '100%', padding: '13px', fontFamily: 'CKCL', fontSize: 14, fontWeight: 600, color: '#FFF', background: busy ? '#B70813' : '#E10B17', border: 'none', borderRadius: 999, cursor: busy ? 'progress' : 'pointer', transition: 'background 160ms', opacity: busy ? 0.85 : 1 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#B70813' }}
        onMouseLeave={(e) => { if (!busy) (e.currentTarget as HTMLElement).style.background = '#E10B17' }}
      >
        {busy ? 'Sending…' : 'Request Booking'}
      </button>
      <div style={{ fontFamily: 'CKCL', fontSize: 12, color: '#A8B0BB', textAlign: 'center', marginTop: 10 }}>
        Confirmation by phone within one business day.
      </div>
    </>
  )
}
