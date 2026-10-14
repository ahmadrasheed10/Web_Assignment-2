import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

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
    setMessage('')
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0]).focus()
      return
    }

    setMessage('Your form looks good. Account sign-in and saving will be added in the next update.')
  }

  function clearFeedback() {
    setErrors({})
    setMessage('')
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-heading">
        <p className="eyebrow">Your next experience awaits</p>
        <h1 id="auth-title">{isRegister ? 'Join Gather.' : 'Welcome back.'}</h1>
        <p>{isRegister ? 'Create your account to keep your favourite experiences together.' : 'Sign in to manage your events.'}</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit} onChange={clearFeedback} noValidate>
        <p className="form-note">Form preview: accounts and login sessions are coming in the next update. No account data is saved yet.</p>
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
        <button className="button" type="submit">Check form</button>
        <p className="form-status" role="status">{message}</p>
        <p className="auth-switch">
          {isRegister ? 'Already have an account? ' : 'New to Gather? '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
        </p>
      </form>
    </section>
  )
}
