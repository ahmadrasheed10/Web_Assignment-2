import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AuthForm from './components/AuthForm'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import MyEvents from './pages/MyEvents'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="login" element={<AuthForm key="login" mode="login" />} />
        <Route path="register" element={<AuthForm key="register" mode="register" />} />
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
