import { configureStore } from '@reduxjs/toolkit'
import auth from './auth.js'
import events from './events.js'
import registrations from './registrations.js'

export const store = configureStore({ reducer: { auth, events, registrations } })
