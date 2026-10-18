import test, { afterEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import { fetchUpcomingEvents, fetchEventDetails, normalizeEvent } from '../src/services/ticketmaster.js'
import reducer, { loadEvents, loadEventDetails } from '../src/store/events.js'

afterEach(() => mock.restoreAll())
const fixture = { id: 'concert', name: 'Live show', dates: { start: { localDate: '2099-10-18', localTime: '19:30:00', dateTime: '2099-10-18T18:30:00Z' }, timezone: 'Europe/London' }, _embedded: { venues: [{ name: 'Hall', city: { name: 'London' }, address: { line1: '10 Main Street' } }] }, images: [{ url: 'https://example.com/image.jpg', width: 1024, ratio: '16_9' }] }

test('search sends encoded filters and maps Ticketmaster event fields', async () => {
  mock.method(globalThis, 'fetch', async (url) => {
    const query = new URL(url).searchParams
    assert.equal(query.get('keyword'), 'rock & roll')
    assert.equal(query.get('segmentName'), 'Arts & Theatre')
    assert.equal(query.get('sort'), 'date,asc')
    assert.match(query.get('startDateTime'), /T\d{2}:\d{2}:\d{2}Z$/)
    return { ok: true, json: async () => ({ _embedded: { events: [fixture] } }) }
  })
  const [event] = await fetchUpcomingEvents({ apiKey: 'fixture-key', keyword: ' rock & roll ', category: 'Arts & Theatre' })
  assert.equal(event.id, 'concert')
  assert.equal(event.venue, 'Hall')
  assert.equal(event.timezone, 'Europe/London')
  assert.equal(event.image, fixture.images[0].url)
})

test('empty results and missing event data have usable fallbacks', async () => {
  mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({}) }))
  assert.deepEqual(await fetchUpcomingEvents({ apiKey: 'fixture-key' }), [])
  const event = normalizeEvent({ id: 'bare', url: 'javascript:alert(1)', classifications: [{ segment: { name: 'Undefined' } }] })
  assert.equal(event.date, null)
  assert.equal(event.url, null)
  assert.equal(event.category, 'Other')
  assert.equal(event.venue, 'Venue to be announced')
  assert.deepEqual(event.prices, [])
  const undated = normalizeEvent({ dates: { start: { dateTBD: true, dateTime: '2000-01-01T00:00:00Z' } } })
  assert.equal(undated.dateTime, null)
})

test('detail requests encode IDs and retain notes and price ranges', async () => {
  mock.method(globalThis, 'fetch', async (url) => {
    assert.equal(new URL(url).pathname, '/discovery/v2/events/a%2Fb.json')
    return { ok: true, json: async () => ({ ...fixture, info: 'About', pleaseNote: 'Bring ID', priceRanges: [{ min: 10, max: 20, currency: 'GBP' }] }) }
  })
  const event = await fetchEventDetails('a/b', { apiKey: 'fixture-key' })
  assert.equal(event.description, 'About')
  assert.equal(event.notes, 'Bring ID')
  assert.equal(event.prices[0].currency, 'GBP')
})

test('missing keys, invalid responses, and API errors produce readable messages', async () => {
  await assert.rejects(fetchUpcomingEvents({ apiKey: '' }), /API key/)
  for (const [status, message] of [[401, /rejected/], [403, /rejected/], [404, /could not be found/], [429, /too many/], [500, /could not be loaded/]]) {
    mock.method(globalThis, 'fetch', async () => ({ ok: false, status }))
    await assert.rejects(fetchEventDetails('test', { apiKey: 'fixture-key' }), message)
    mock.restoreAll()
  }
  mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => null }))
  await assert.rejects(fetchEventDetails('test', { apiKey: 'fixture-key' }), /unexpected response/)
})

test('network failures, timeout and request cancellation are handled', async () => {
  for (const [error, message] of [[new TypeError('network'), /connection/], [new DOMException('slow', 'TimeoutError'), /too long/], [new DOMException('cancel', 'AbortError'), /cancel/]]) {
    mock.method(globalThis, 'fetch', async () => { throw error })
    await assert.rejects(fetchUpcomingEvents({ apiKey: 'fixture-key' }), message)
    mock.restoreAll()
  }
})

test('search retry retains filters and old detail requests cannot replace newer pages', () => {
  const filters = { keyword: 'concert', category: 'Music' }
  let state = reducer(undefined, loadEvents.pending('search', filters))
  state = reducer(state, loadEvents.fulfilled([normalizeEvent(fixture)], 'search', filters))
  state = reducer(state, loadEvents.pending('retry'))
  assert.deepEqual(state.filters, filters)
  assert.deepEqual(state.items, [])
  state = reducer(state, loadEvents.rejected(null, 'retry', undefined, 'Offline'))
  assert.equal(state.error, 'Offline')
  state = reducer(state, loadEventDetails.pending('first', 'a'))
  state = reducer(state, loadEventDetails.pending('second', 'b'))
  state = reducer(state, loadEventDetails.fulfilled({ id: 'a' }, 'first', 'a'))
  assert.equal(state.detail, null)
  state = reducer(state, loadEventDetails.fulfilled({ id: 'b' }, 'second', 'b'))
  assert.equal(state.detail.id, 'b')
})
