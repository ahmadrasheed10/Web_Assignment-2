import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadEventDetails } from '../store/events'
import { formatDate } from '../utils/formatDate'
import EventRegistration from '../components/EventRegistration'

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { detail: event, detailId, detailStatus, detailError } = useSelector((state) => state.events)
  const userId = useSelector((state) => state.auth.user?.id || 'guest')

  useEffect(() => { dispatch(loadEventDetails(id)) }, [dispatch, id])

  const loading = detailId !== id || detailStatus === 'loading' || detailStatus === 'idle'
  return (
    <section className="events-page" aria-label="Event details">
      <Link to="/events">← Back to events</Link>
      {loading ? <p role="status">Loading event details…</p> : detailStatus === 'failed' ? (
        <div className="development-note">
          <p role="alert">{detailError}</p>
          <button className="button" onClick={() => dispatch(loadEventDetails(id))}>Try again</button>
        </div>
      ) : event && (
        <div className="event-details">
          <div className="event-image detail-image">
            {event.image ? <img src={event.image} alt="" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : <span>Gather live</span>}
          </div>
          <div>
            <p className="eyebrow">{event.category}</p>
            <h1>{event.name}</h1>
            <dl className="event-facts">
              <div><dt>Date</dt><dd>{formatDate(event.date)}</dd></div>
              <div><dt>Time</dt><dd>{event.time ? `${event.time.slice(0, 5)} (venue time)` : 'Time to be announced'}</dd></div>
              <div><dt>Venue</dt><dd>{event.venue}</dd></div>
              <div><dt>Location</dt><dd>{[event.address, event.location].filter(Boolean).join(', ') || 'Location to be announced'}</dd></div>
              {event.genre && event.genre !== 'Undefined' && <div><dt>Genre</dt><dd>{event.genre}</dd></div>}
              {event.status && <div><dt>Status</dt><dd className="event-status">{event.status.replaceAll('_', ' ')}</dd></div>}
            </dl>
            {event.prices.length > 0 && <div className="detail-section"><h2>Ticket prices</h2>{event.prices.map((price, index) => <p key={index}>{price.currency} {price.min} – {price.max}</p>)}<p className="field-hint">Prices are provided by Ticketmaster and may exclude fees.</p></div>}
            {event.description && <div className="detail-section"><h2>About this event</h2><p>{event.description}</p></div>}
            {event.notes && <div className="detail-section"><h2>Before you go</h2><p>{event.notes}</p></div>}
            <EventRegistration key={`${event.id}-${userId}`} event={event} />
            {event.url && <a className="button" href={event.url} target="_blank" rel="noopener noreferrer">View on Ticketmaster ↗<span className="sr-only"> (opens in a new tab)</span></a>}
          </div>
        </div>
      )}
    </section>
  )
}
