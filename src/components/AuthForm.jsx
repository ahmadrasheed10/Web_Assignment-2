import React, { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authenticate, clearError } from '../store/auth'

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.auth)
  const location = useLocation()
  const from = location.state?.from
  const destination = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !/^\/(login|register)(\/|$)/.test(from) ? from : '/'

  if (user) return <Navigate to={destination} replace />

  function handleSubmit(event) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const nextErrors = {}
    const name = String(values.get('name') || '').trim()
    const email = String(values.get('email') || '').trim()
    const password = String(values.get('password') || '')

    if (isRegister && name.length < 2) {
      nextErrors.name = 'Enter a name with at least 2 characters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!password.trim()) {
      nextErrors.password = 'Enter your password.'
    } else if (isRegister && password.length < 8) {
      nextErrors.password = 'Use at least 8 characters for your password.'
    }

    setErrors(nextErrors)
    dispatch(clearError())
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0]).focus()
      return
    }

    dispatch(authenticate({ name, email, password, isRegister }))
  }

  function clearFeedback(event) {
    const field = event.target.name
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
    dispatch(clearError())
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-heading">
        <p className="eyebrow">Your next experience awaits</p>
        <h1 id="auth-title">{isRegister ? 'Join Gather.' : 'Welcome back.'}</h1>
        <p>{isRegister ? 'Create your account to keep your favourite experiences together.' : 'Sign in to manage your events.'}</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} onChange={clearFeedback} noValidate>
        <p className="form-note">Accounts are saved in this browser for this class project. Use a practice password.</p>
        <fieldset className="auth-fields" disabled={status === 'loading'}>
        {isRegister && (
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" autoComplete="name" required minLength={2} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>
        )}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : undefined} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : isRegister ? 'password-hint' : undefined} />
          {isRegister && <p id="password-hint" className="field-hint">Use at least 8 characters.</p>}
          {errors.password && <p id="password-error" className="field-error">{errors.password}</p>}
        </div>
        <button className="button" type="submit">{status === 'loading' ? 'Please wait…' : isRegister ? 'Create account' : 'Login'}</button>
        </fieldset>
        <p className="field-error" role="alert">{error}</p>
        <p className="auth-switch">
          {isRegister ? 'Already have an account? ' : 'New to Gather? '}
          <Link to={isRegister ? '/login' : '/register'} state={{ from: destination }}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </form>
    </section>
  )
}
