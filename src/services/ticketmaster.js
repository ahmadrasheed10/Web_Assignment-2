export const hasApiKey = Boolean(import.meta.env?.VITE_TICKETMASTER_API_KEY?.trim())

export function normalizeEvent(event) {
  const venue = event._embedded?.venues?.[0]
  const start = event.dates?.start
  const image = event.images?.find((item) => item.ratio === '16_9' && item.width >= 600) || event.images?.[0]
  return {
    id: event.id,
    name: event.name || 'Untitled event',
    date: start?.dateTBA || start?.dateTBD ? null : start?.localDate || null,
    time: start?.timeTBA || start?.noSpecificTime ? null : start?.localTime || null,
    dateTime: start?.dateTime || null,
    venue: venue?.name || 'Venue to be announced',
    location: [venue?.city?.name, venue?.state?.stateCode, venue?.country?.name].filter(Boolean).join(', '),
    category: event.classifications?.[0]?.segment?.name || 'Other',
    image: image?.url?.startsWith('https://') ? image.url : null,
    url: event.url?.startsWith('https://') ? event.url : null,
    description: event.info || '',
    notes: event.pleaseNote || '',
    address: venue?.address?.line1 || '',
    genre: event.classifications?.[0]?.genre?.name || '',
    status: event.dates?.status?.code || '',
    prices: (event.priceRanges || []).map(({ min, max, currency }) => ({ min, max, currency })),
  }
}

export async function fetchUpcomingEvents({ apiKey = import.meta.env?.VITE_TICKETMASTER_API_KEY, signal, keyword = '', category = '' } = {}) {
  if (!apiKey?.trim()) throw new Error('Add your Ticketmaster API key to .env, then restart the dev server.')
  const params = new URLSearchParams({
    apikey: apiKey.trim(),
    size: '12',
    sort: 'date,asc',
    startDateTime: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  })
  if (keyword.trim()) params.set('keyword', keyword.trim())
  if (category) params.set('segmentName', category)
  const data = await requestTicketmaster('events.json', { apiKey, signal, params })
  const events = data._embedded?.events || []
  if (!Array.isArray(events)) throw new Error('Ticketmaster returned an unexpected response. Please try again.')
  return events.filter((event) => event?.id).map(normalizeEvent)
}

export async function fetchEventDetails(id, { apiKey = import.meta.env?.VITE_TICKETMASTER_API_KEY, signal } = {}) {
  const data = await requestTicketmaster(`events/${encodeURIComponent(id)}.json`, { apiKey, signal })
  if (!data?.id) throw new Error('Ticketmaster returned an unexpected response. Please try again.')
  return normalizeEvent(data)
}

async function requestTicketmaster(path, { apiKey, signal, params = new URLSearchParams() }) {
  if (!apiKey?.trim()) throw new Error('Add your Ticketmaster API key to .env, then restart the dev server.')
  params.set('apikey', apiKey.trim())
  let response
  try {
    response = await fetch(`https://app.ticketmaster.com/discovery/v2/${path}?${params}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Could not connect to Ticketmaster. Check your connection and try again.')
  }
  if (response.status === 401 || response.status === 403) throw new Error('Ticketmaster rejected the API key. Check your .env setting and restart the dev server.')
  if (response.status === 429) throw new Error('Ticketmaster is receiving too many requests. Please try again later.')
  if (response.status === 404) throw new Error('This event could not be found. It may no longer be available.')
  if (!response.ok) throw new Error('Events could not be loaded. Please try again.')
  return response.json()
}
