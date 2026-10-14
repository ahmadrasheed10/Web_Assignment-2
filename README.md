# Gather — Event Management System

Web Programming Assignment 2 · Instructor: Mahhek Tahir

A React application for discovering Ticketmaster events and managing personal event registrations. The project is being implemented incrementally, with a meaningful commit for each milestone.

## Current progress

Milestone 1: React project setup, responsive home page, reusable layout, React Router navigation and a not-found page. Redux Toolkit and React Redux are installed for upcoming state management work.

Event listings, authentication, and event registration are **not implemented yet**. The home page introduces the app; its categories are informational, not live event filters.

## Run locally

Use Node.js 22.12+ (Node 24 LTS recommended) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm run build
npm run preview
```

The build command generates `dist/`; preview serves that production build locally. Production hosting will need an SPA fallback to `index.html` for React Router routes.

## API configuration (for a later milestone)

Copy `.env.example` to `.env`, then fill in `VITE_TICKETMASTER_API_KEY` with your own key from the [Ticketmaster developer portal](https://developer.ticketmaster.com/). The current starter does not call the API or require a key.

Never commit `.env` or a real API key. Vite environment variables are visible in the browser bundle when used; they are not server-side secrets.

## Planned milestones

- [x] 1. Initial React setup and responsive application shell.
- [ ] 2. Login and registration pages with form validation.
- [ ] 3. Redux authentication, persistent sessions, logout, and protected routes.
- [ ] 4. Ticketmaster API integration, event listing, loading and error states.
- [ ] 5. Event search, category filters, and event details.
- [ ] 6. Per-user event registration, duplicate prevention, and cancellation.
- [ ] 7. My Events with upcoming/completed groups and final responsive checks.

Each milestone should be implemented and committed as real work progresses.

## Structure

```text
src/
  components/Layout.jsx  Shared header, footer, and page outlet
  pages/Home.jsx         Introductory home page
  App.jsx                Routes
  main.jsx               React entry point
  styles.css             Responsive styles
```

## Technology

React, Vite, React Router, Redux Toolkit, React Redux, and (in a later milestone) the Ticketmaster Discovery API.
