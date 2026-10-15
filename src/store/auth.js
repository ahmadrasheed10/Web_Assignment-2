import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const accountsKey = 'gather.accounts'
const sessionKey = 'gather.session'

function readAccounts() {
  const accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]')
  if (!Array.isArray(accounts)) throw new Error('Saved accounts could not be read.')
  return accounts
}

function publicUser(account) {
  return { id: account.id, name: account.name, email: account.email }
}

function restoreUser() {
  try {
    const id = localStorage.getItem(sessionKey)
    const account = readAccounts().find((item) => item.id === id)
    return account ? publicUser(account) : null
  } catch {
    return null
  }
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' }, key, 256)
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const authenticate = createAsyncThunk('auth/authenticate', async ({ name, email, password, isRegister }, { rejectWithValue }) => {
  try {
    const accounts = readAccounts()
    const normalizedEmail = email.trim().toLowerCase()
    let account = accounts.find((item) => item.email === normalizedEmail)

    if (isRegister) {
      if (account) return rejectWithValue('An account with this email already exists.')
      const salt = crypto.randomUUID()
      account = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) }
      // Read again after hashing so another completed registration is preserved.
      const latestAccounts = readAccounts()
      if (latestAccounts.some((item) => item.email === normalizedEmail)) {
        return rejectWithValue('An account with this email already exists.')
      }
      localStorage.setItem(accountsKey, JSON.stringify([...latestAccounts, account]))
    } else if (!account || await hashPassword(password, account.salt) !== account.passwordHash) {
      return rejectWithValue('Email or password is incorrect.')
    }

    localStorage.setItem(sessionKey, account.id)
    return publicUser(account)
  } catch {
    return rejectWithValue('Could not access saved accounts. Allow browser storage and try again.')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem(sessionKey)
  } catch {
    return rejectWithValue('Could not clear your saved session. Please try again.')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: restoreUser(), status: 'idle', error: null },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(authenticate.fulfilled, (state, action) => { state.status = 'idle'; state.user = action.payload })
      .addCase(authenticate.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload || 'Please try again.' })
      .addCase(logout.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.status = 'idle'; state.error = null })
      .addCase(logout.rejected, (state, action) => { state.status = 'idle'; state.error = action.payload || 'Please try again.' })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
