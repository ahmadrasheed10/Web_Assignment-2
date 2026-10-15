import { configureStore } from '@reduxjs/toolkit'
import auth from './auth.js'

export const store = configureStore({ reducer: { auth } })
