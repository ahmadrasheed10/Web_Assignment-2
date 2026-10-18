import test from 'node:test'
import assert from 'node:assert/strict'
import { hasEventPassed } from '../src/utils/eventDate.js'
import { formatDate } from '../src/utils/formatDate.js'

test('event timestamps separate upcoming and past events', () => {
  const now = new Date('2026-10-18T12:00:00Z')
  assert.equal(hasEventPassed({ dateTime: '2026-10-18T11:00:00Z' }, now), true)
  assert.equal(hasEventPassed({ dateTime: '2026-10-18T13:00:00Z' }, now), false)
  assert.equal(hasEventPassed({ dateTime: now.toISOString() }, now), true)
  assert.equal(hasEventPassed({}, now), false)
})

test('date-only events use the venue timezone and retain same-day registrations', () => {
  const now = new Date('2026-10-18T02:00:00Z')
  assert.equal(hasEventPassed({ date: '2026-10-17', timezone: 'America/Los_Angeles' }, now), false)
  assert.equal(hasEventPassed({ date: '2026-10-17', timezone: 'Asia/Karachi' }, now), true)
  assert.equal(hasEventPassed({ date: '2026-10-18', timezone: 'Asia/Karachi' }, now), false)
  assert.equal(hasEventPassed({ date: '2026-10-17', timezone: 'invalid' }, now), true)
  assert.equal(hasEventPassed({ dateTime: 'invalid', date: '2026-10-17' }, now), true)
})

test('display dates do not shift into the previous day', () => {
  assert.equal(formatDate('2026-10-18'), '18 Oct 2026')
  assert.equal(formatDate(null), 'Date to be announced')
})
