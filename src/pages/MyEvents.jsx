import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import { saveRegistration } from '../store/registrations'
import { hasEventPassed } from '../utils/eventDate'

const emptyRegistrations = []

export default function MyEvents() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registrations = useSelector((state) => state.registrations.byUser[user?.id] || emptyRegistrations)
  const [feedback, setFeedback] = useState(null)
  const [busy, setBusy] = useState(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const upcoming = registrations.filter(({ event }) => !hasEventPassed(event, now))
  const completed = registrations.filter(({ event }) => hasEventPassed(event, now))

  async function cancel(event) {
    setBusy(event.id)
    setFeedback(null)
    const result = await dispatch(saveRegistration({ event, cancel: true }))
    setFeedback(saveRegistration.fulfilled.match(result)
      ? { text: `Registration for ${event.name} cancelled.`, error: false }
      : { text: result.payload || 'Could not cancel your registration.', error: true })
    setBusy(null)
  }

  return (
    <section className="events-page" aria-labelledby="my-events-title">
      <p className="eyebrow">Your plans, together</p>
      <h1 id="my-events-title">My events.</h1>
      <p className="intro">Your saved registrations in Gather. Events with an unannounced date stay in upcoming.</p>
      <div role="status">{feedback && !feedback.error ? feedback.text : ''}</div>
      {feedback?.error && <p className="field-error" role="alert">{feedback.text}</p>}
      {registrations.length === 0 ? (
        <div className="development-note"><p>You haven’t registered for any events yet.</p><Link className="button" to="/events">Explore events</Link></div>
      ) : (
        <>
          <h2>Upcoming ({upcoming.length})</h2>
          {upcoming.length === 0 && <p>No upcoming registrations. <Link to="/events">Find your next event.</Link></p>}
          <div className="event-grid my-events-grid">
            {upcoming.map(({ event }) => (
              <div className="saved-event" key={event.id}>
                <EventCard event={event} />
                <button className="nav-button cancel-registration" disabled={busy !== null} onClick={() => cancel(event)}>{busy === event.id ? 'Cancelling…' : 'Cancel registration'}</button>
              </div>
            ))}
          </div>
          <h2>Completed ({completed.length})</h2>
          {completed.length === 0 && <p>Your past events will appear here.</p>}
          <div className="event-grid">{completed.map(({ event }) => <EventCard key={event.id} event={event} />)}</div>
        </>
      )}
    </section>
  )
}
