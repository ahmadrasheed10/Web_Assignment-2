import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={
          <section className="empty-state">
            <p className="eyebrow">404 / Page not found</p>
            <h1>Let’s get you back.</h1>
            <Link className="button" to="/">Back to home</Link>
          </section>
        } />
      </Route>
    </Routes>
  )
}
