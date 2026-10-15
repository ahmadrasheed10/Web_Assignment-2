import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const storageKey = 'gather.registrations'

function readRegistrations() {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
  if (!saved || Array.isArray(saved) || typeof saved !== 'object' || Object.values(saved).some((items) => !Array.isArray(items) || items.some((item) => !item?.event?.id))) {
    throw new Error('Invalid registrations')
  }
  return saved
}

function initialRegistrations() {
  try { return readRegistrations() } catch { return {} }
}

export const saveRegistration = createAsyncThunk('registrations/save', ({ event, cancel = false }, { getState, rejectWithValue }) => {
  const user = getState().auth.user
  if (!user) return rejectWithValue('Please login to register for an event.')
  if (!event?.id) return rejectWithValue('Please select an event first.')
  if (!cancel && event.status === 'cancelled') return rejectWithValue('This event has been cancelled.')
  if (!cancel && event.dateTime && new Date(event.dateTime).getTime() <= Date.now()) {
    return rejectWithValue('Registration has closed for this event.')
  }

  try {
    const saved = readRegistrations()
    const registrations = saved[user.id] || []
    const exists = registrations.some((item) => item.event.id === event.id)
    if (!cancel && exists) return rejectWithValue('You are already registered for this event.')
    if (cancel && !exists) return rejectWithValue('You are not registered for this event.')

    const items = cancel
      ? registrations.filter((item) => item.event.id !== event.id)
      : [...registrations, { event, registeredAt: new Date().toISOString() }]
    localStorage.setItem(storageKey, JSON.stringify({ ...saved, [user.id]: items }))
    return { userId: user.id, items }
  } catch {
    return rejectWithValue('Could not save your registration. Check browser storage and try again.')
  }
})

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { byUser: initialRegistrations() },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveRegistration.fulfilled, (state, action) => {
      state.byUser[action.payload.userId] = action.payload.items
    })
  },
})

export default registrationsSlice.reducer
