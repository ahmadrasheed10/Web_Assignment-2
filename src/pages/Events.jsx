import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadEvents } from '../store/events'
import { hasApiKey } from '../services/ticketmaster'
import EventCard from '../components/EventCard'

export default function Events() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.events)

  useEffect(() => {
    if (hasApiKey && status === 'idle') dispatch(loadEvents())
  }, [dispatch, status])

  return (
    <section className="events-page" aria-labelledby="events-title">
      <p className="eyebrow">Find your next plan</p>
      <h1 id="events-title">Upcoming events.</h1>
      <p className="intro">Discover live experiences from Ticketmaster, starting with the next events on the calendar.</p>
      {!hasApiKey ? (
        <div className="development-note">
          <h2>Connect Ticketmaster</h2>
          <p>Copy <code>.env.example</code> to <code>.env</code>, set <code>VITE_TICKETMASTER_API_KEY</code> to your own API key, then restart the dev server.</p>
          <a href="https://developer.ticketmaster.com/" target="_blank" rel="noopener noreferrer">Get an API key (opens in a new tab)</a>
        </div>
      ) : (
        <div aria-busy={status === 'loading'}>
          <p role="status">{status === 'loading' ? 'Loading events…' : status === 'succeeded' ? `${items.length} upcoming events loaded.` : ''}</p>
          {status === 'failed' && <div className="development-note"><p role="alert">{error}</p><button className="button" onClick={() => dispatch(loadEvents())}>Try again</button></div>}
          {status === 'succeeded' && items.length === 0 && <p className="development-note">No upcoming events were found. Check back soon.</p>}
          <div className="event-grid">{items.map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      )}
    </section>
  )
}
