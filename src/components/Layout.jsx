import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Gather home">gather<span>.</span></Link>
        <nav aria-label="Main navigation"><Link to="/">Home</Link></nav>
      </header>
      <main id="main"><Outlet /></main>
      <footer className="site-footer">
        <span className="brand">gather<span>.</span></span>
        <p>Web Programming · Assignment 2</p>
        <span>Made for memorable moments.</span>
      </footer>
    </div>
  )
}
