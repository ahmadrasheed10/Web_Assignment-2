import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { configureStore } from '@reduxjs/toolkit'
import auth, { authenticate, logout } from '../src/store/auth.js'
import registrations, { saveRegistration } from '../src/store/registrations.js'

let saved
beforeEach(() => {
  saved = new Map()
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, String(value)),
    removeItem: (key) => saved.delete(key),
  }
})
const makeStore = () => configureStore({ reducer: { auth, registrations } })
const account = { name: 'Test User', email: 'Test@example.com', password: 'practice123', isRegister: true }
const event = { id: 'future', name: 'Future concert', dateTime: '2099-01-01T20:00:00Z' }

test('register, reject duplicates and wrong passwords, login and restore a session', async () => {
  const store = makeStore()
  await store.dispatch(authenticate(account)).unwrap()
  const user = store.getState().auth.user
  assert.equal(user.email, 'test@example.com')
  assert.equal(saved.get('gather.session'), user.id)
  assert.equal(saved.get('gather.accounts').includes(account.password), false)
  assert.equal('passwordHash' in user, false)
  const duplicate = await store.dispatch(authenticate(account))
  assert.match(duplicate.payload, /already exists/)
  await store.dispatch(logout()).unwrap()
  assert.equal(store.getState().auth.user, null)
  assert.equal(saved.has('gather.session'), false)
  const wrong = await store.dispatch(authenticate({ ...account, isRegister: false, password: 'incorrect' }))
  assert.match(wrong.payload, /incorrect/)
  assert.equal(store.getState().auth.user, null)
  await store.dispatch(authenticate({ ...account, email: ' TEST@EXAMPLE.COM ', isRegister: false })).unwrap()
  const restored = await import('../src/store/auth.js?session-test')
  assert.equal(restored.default(undefined, { type: 'init' }).user.id, user.id)
})

test('registrations require login, prevent duplicates and stay separate between users', async () => {
  const store = makeStore()
  assert.match((await store.dispatch(saveRegistration({ event }))).payload, /login/)
  await store.dispatch(authenticate(account)).unwrap()
  const firstId = store.getState().auth.user.id
  await store.dispatch(saveRegistration({ event })).unwrap()
  assert.match((await store.dispatch(saveRegistration({ event }))).payload, /already registered/)
  await store.dispatch(logout()).unwrap()
  await store.dispatch(authenticate({ ...account, email: 'other@example.com' })).unwrap()
  const secondId = store.getState().auth.user.id
  await store.dispatch(saveRegistration({ event })).unwrap()
  await store.dispatch(saveRegistration({ event, cancel: true })).unwrap()
  assert.equal(store.getState().registrations.byUser[firstId].length, 1)
  assert.equal(store.getState().registrations.byUser[secondId].length, 0)
  assert.match((await store.dispatch(saveRegistration({ event, cancel: true }))).payload, /not registered/)
  const restored = await import('../src/store/registrations.js?registration-test')
  assert.equal(restored.default(undefined, { type: 'init' }).byUser[firstId][0].event.id, event.id)
})

test('closed events and storage failures do not change saved registrations', async () => {
  const store = makeStore()
  await store.dispatch(authenticate(account)).unwrap()
  assert.match((await store.dispatch(saveRegistration({ event: { ...event, status: 'cancelled' } }))).payload, /cancelled/)
  const past = { ...event, dateTime: '2000-01-01T00:00:00Z' }
  assert.match((await store.dispatch(saveRegistration({ event: past }))).payload, /closed/)
  assert.match((await store.dispatch(saveRegistration({ event: past, cancel: true }))).payload, /cannot be cancelled/)
  await store.dispatch(saveRegistration({ event })).unwrap()
  const before = store.getState().registrations
  localStorage.setItem = () => { throw new Error('Storage full') }
  assert.match((await store.dispatch(saveRegistration({ event, cancel: true }))).payload, /Could not save/)
  assert.deepEqual(store.getState().registrations, before)
})

test('malformed browser storage does not crash session restoration or overwrite data', async () => {
  saved.set('gather.accounts', '{broken')
  saved.set('gather.registrations', '{broken')
  const restoredAuth = await import('../src/store/auth.js?broken-test')
  const restoredRegistrations = await import('../src/store/registrations.js?broken-test')
  assert.equal(restoredAuth.default(undefined, { type: 'init' }).user, null)
  assert.deepEqual(restoredRegistrations.default(undefined, { type: 'init' }).byUser, {})
  const result = await makeStore().dispatch(authenticate(account))
  assert.match(result.payload, /Could not access/)
  assert.equal(saved.get('gather.accounts'), '{broken')
})
