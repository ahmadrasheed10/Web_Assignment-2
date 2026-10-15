import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUpcomingEvents, fetchEventDetails } from '../services/ticketmaster.js'

export const loadEventDetails = createAsyncThunk('events/details', async (id, { signal, rejectWithValue }) => {
  try {
    return await fetchEventDetails(id, { signal })
  } catch (error) {
    return rejectWithValue(error.message)
  }
}, {
  condition: (id, { getState }) => {
    const state = getState().events
    return state.detailId !== id || !['loading', 'succeeded'].includes(state.detailStatus)
  },
})

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
  initialState: { items: [], status: 'idle', error: null, filters: { keyword: '', category: '' }, detail: null, detailId: null, detailStatus: 'idle', detailError: null, detailRequestId: null },
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
      .addCase(loadEventDetails.pending, (state, action) => {
        state.detailId = action.meta.arg
        state.detailRequestId = action.meta.requestId
        state.detail = null
        state.detailStatus = 'loading'
        state.detailError = null
      })
      .addCase(loadEventDetails.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detail = action.payload
        state.detailStatus = 'succeeded'
      })
      .addCase(loadEventDetails.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return
        state.detailStatus = 'failed'
        state.detailError = action.payload || 'Could not load this event.'
      })
  },
})

export default eventsSlice.reducer
