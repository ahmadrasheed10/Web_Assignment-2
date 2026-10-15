import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/auth'

export default function Layout() {
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.auth)
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Gather home">gather<span>.</span></Link>
        <nav aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          {user ? (
            <>
              <NavLink to="/my-events">My Events</NavLink>
              <span className="user-name">Hi, {user.name}</span>
              <button className="nav-button" disabled={status === 'loading'} onClick={() => dispatch(logout())}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      {user && error && <p className="field-error" role="alert">{error}</p>}
      <main id="main"><Outlet /></main>
      <footer className="site-footer">
        <span className="brand">gather<span>.</span></span>
        <p>Web Programming · Assignment 2</p>
        <span>Made for memorable moments.</span>
      </footer>
    </div>
  )
}
