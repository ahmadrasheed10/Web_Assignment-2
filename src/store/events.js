import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUpcomingEvents } from '../services/ticketmaster.js'

export const loadEvents = createAsyncThunk('events/load', async (filters, { signal, getState, rejectWithValue }) => {
  try {
    return await fetchUpcomingEvents({ ...getState().events.filters, signal })
  } catch (error) {
    return rejectWithValue(error.message)
  }
}, {
  condition: (_, { getState }) => getState().events.status !== 'loading',
})

const eventsSlice = createSlice({
  name: 'events',
  initialState: { items: [], status: 'idle', error: null, filters: { keyword: '', category: '' } },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.items = []
        if (action.meta.arg) state.filters = action.meta.arg
      })
      .addCase(loadEvents.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload })
      .addCase(loadEvents.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Could not load events.' })
  },
})

export default eventsSlice.reducer
