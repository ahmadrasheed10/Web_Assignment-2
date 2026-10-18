import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'
import EventImage from './EventImage'

export default function EventCard({ event }) {
  const date = formatDate(event.date)
  return (
    <article className="event-card">
      <EventImage src={event.image} />
      <div className="event-info">
        <span className="category-number">{event.category}</span>
        <h2><Link to={`/events/${encodeURIComponent(event.id)}`}>{event.name}</Link></h2>
        <p className="event-date">{date}{event.time && ` · ${event.time.slice(0, 5)} (venue time)`}</p>
        <p>{event.venue}</p>
        {event.location && <p>{event.location}</p>}
        <Link className="event-link" to={`/events/${encodeURIComponent(event.id)}`}>View details <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  )
}
