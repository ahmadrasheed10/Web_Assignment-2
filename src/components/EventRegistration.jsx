import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveRegistration } from '../store/registrations'
import { hasEventPassed } from '../utils/eventDate'

export default function EventRegistration({ event }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registered = useSelector((state) => Boolean(user && state.registrations.byUser[user.id]?.some((item) => item.event.id === event.id)))
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const completed = hasEventPassed(event)
  const closed = event.status === 'cancelled' || completed

  async function handleRegistration() {
    setBusy(true)
    setFeedback(null)
    const result = await dispatch(saveRegistration({ event, cancel: registered }))
    if (saveRegistration.fulfilled.match(result)) {
      setFeedback({ text: registered ? 'Your registration has been cancelled.' : 'You are registered for this event.', error: false })
    } else {
      setFeedback({ text: result.payload || 'Please try again.', error: true })
    }
    setBusy(false)
  }

  return (
    <div className="registration-box">
      <h2>{registered ? 'You’re registered' : 'Join this event'}</h2>
      <p>This saves your registration in Gather. Tickets are purchased separately through Ticketmaster.</p>
      {!user ? <Link className="button" to="/login" state={{ from: `/events/${encodeURIComponent(event.id)}` }}>Login to register</Link> : (
        <button className="button" disabled={busy || completed || (!registered && closed)} onClick={handleRegistration}>
          {busy ? 'Saving…' : completed ? 'Registration closed' : registered ? 'Cancel registration' : closed ? 'Registration closed' : 'Register for event'}
        </button>
      )}
      {registered && <p><Link to="/my-events">View My Events</Link></p>}
      {feedback && <p className={feedback.error ? 'field-error' : 'form-status'} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
    </div>
  )
}
