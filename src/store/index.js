import { configureStore } from '@reduxjs/toolkit'
import auth from './auth.js'
import events from './events.js'

export const store = configureStore({ reducer: { auth, events } })
