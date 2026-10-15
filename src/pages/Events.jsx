import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadEvents } from '../store/events'
import { hasApiKey } from '../services/ticketmaster'
import EventCard from '../components/EventCard'

export default function Events() {
  const dispatch = useDispatch()
  const { items, status, error, filters } = useSelector((state) => state.events)
  const [keyword, setKeyword] = useState(filters.keyword)
  const [category, setCategory] = useState(filters.category)

  function search(event) {
    event.preventDefault()
    dispatch(loadEvents({ keyword: keyword.trim(), category }))
  }

  function resetSearch() {
    setKeyword('')
    setCategory('')
    dispatch(loadEvents({ keyword: '', category: '' }))
  }

  useEffect(() => {
    if (hasApiKey && status === 'idle') dispatch(loadEvents())
  }, [dispatch, status])

  return (
    <section className="events-page" aria-labelledby="events-title">
      <p className="eyebrow">Find your next plan</p>
      <h1 id="events-title">Upcoming events.</h1>
      <p className="intro">Discover live experiences from Ticketmaster, starting with the next events on the calendar.</p>
      <form className="event-search" onSubmit={search} role="search" aria-label="Search events">
        <fieldset disabled={!hasApiKey || status === 'loading'}>
          <div className="search-field">
            <label htmlFor="event-keyword">Search events</label>
            <input id="event-keyword" type="search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Artist, team, or event name" />
          </div>
          <div className="search-field">
            <label htmlFor="event-category">Category</label>
            <select id="event-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts & Theatre">Arts & Theatre</option>
              <option value="Film">Film</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <button className="button" type="submit">Search</button>
          <button className="nav-button" type="button" onClick={resetSearch}>Reset</button>
        </fieldset>
      </form>
      {!hasApiKey ? (
        <div className="development-note">
          <h2>Connect Ticketmaster</h2>
          <p>Copy <code>.env.example</code> to <code>.env</code>, set <code>VITE_TICKETMASTER_API_KEY</code> to your own API key, then restart the dev server.</p>
          <a href="https://developer.ticketmaster.com/" target="_blank" rel="noopener noreferrer">Get an API key (opens in a new tab)</a>
        </div>
      ) : (
        <div aria-busy={status === 'loading'}>
          <p role="status">{status === 'loading' ? 'Loading events…' : status === 'succeeded' ? `${items.length} upcoming events shown${filters.keyword ? ` for “${filters.keyword}”` : ''}${filters.category ? ` in ${filters.category}` : ''}.` : ''}</p>
          {status === 'failed' && <div className="development-note"><p role="alert">{error}</p><button className="button" onClick={() => dispatch(loadEvents())}>Try again</button></div>}
          {status === 'succeeded' && items.length === 0 && <p className="development-note">No events match your search. Try another name or reset the filters.</p>}
          <div className="event-grid">{items.map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      )}
    </section>
  )
}
