import React from 'react'

export default function EventCard({ event }) {
  const date = event.date ? new Date(`${event.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Date to be announced'
  return (
    <article className="event-card">
      <div className="event-image">
        {event.image ? <img src={event.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} /> : <span>Gather live</span>}
      </div>
      <div className="event-info">
        <span className="category-number">{event.category}</span>
        <h2>{event.name}</h2>
        <p className="event-date">{date}{event.time && ` · ${event.time.slice(0, 5)} (venue time)`}</p>
        <p>{event.venue}</p>
        {event.location && <p>{event.location}</p>}
        {event.url && <a className="event-link" href={event.url} target="_blank" rel="noopener noreferrer">View on Ticketmaster <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
    </article>
  )
}
