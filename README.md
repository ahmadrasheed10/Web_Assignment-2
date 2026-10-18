# Gather

Web Programming Assignment 2 — Event Management System.

Built with React, Redux Toolkit, React Router and the Ticketmaster Discovery API.

## Setup

Use Node.js 22.12+ or Node.js 24 and npm.

```sh
npm ci
```

Copy `.env.example` to `.env` and add your own key from the [Ticketmaster developer portal](https://developer.ticketmaster.com/):

```env
VITE_TICKETMASTER_API_KEY=your_key_here
```

```sh
npm run dev
```

Open the local URL shown in the terminal. Restart the server after changing `.env`.

## Features

- Register, login and logout, with the session saved across refreshes.
- Browse upcoming events, search by name and filter by category.
- View event images, dates, venue, location, notes and prices when available.
- Register for an event once per account and cancel upcoming registrations.
- View your own upcoming and completed events in My Events.
- Protected My Events page, responsive layout, and loading/error feedback.

Accounts and registrations are saved in this browser using local storage. Authentication is a frontend simulation for the assignment. Passwords are stored as salted hashes; use a practice password. Gather registrations do not buy or reserve Ticketmaster tickets.

My Events uses the event start time to identify past events. If only a date is available, it remains upcoming until that date ends in the venue's timezone. Events with unannounced dates remain upcoming. Saved registrations contain event snapshots from the time of registration.

## Checks and build

```sh
npm test
npm run build
npm run preview
```

Tests cover authentication, per-user registrations, date grouping, API response handling and request state. They use fixtures and do not need an API key. The production build is generated in `dist/`. For deployment, configure an SPA fallback to `index.html` so direct page URLs work.

Keep `.env` out of Git. Each person running the project should supply their own key. Vite includes used `VITE_` variables in the browser bundle, so they are not server-side secrets.

## Source

- `src/pages/` — Home, Events, Event Details and My Events.
- `src/components/` — shared layout, forms, cards and route protection.
- `src/store/` — authentication, events and registration slices.
- `src/services/` — Ticketmaster requests and event mapping.
- `src/utils/` — date formatting and upcoming/past classification.

[Ticketmaster API documentation](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
