# Pin It — Location Saver

A colorful location-saving app with a real backend, so it works properly with
"Use current location" (browser geolocation requires http://, not file://).

## Setup

1. Make sure Node.js is installed (nodejs.org).
2. Open a terminal in this folder.
3. Install the one dependency:
   npm install
4. Start the server:
   npm start
5. Open http://localhost:3000 in your browser.

## What it does

- Save a place with just a name — every other field (category, rating,
  address, coordinates, phone, website, tags, notes) is optional.
- Tap "Use current location" to auto-fill your exact coordinates.
- Every saved place gets an "open in Maps" link.
- Edit or delete any place from its card.
- Data is stored in data/locations.json on your machine — it persists
  between restarts.
