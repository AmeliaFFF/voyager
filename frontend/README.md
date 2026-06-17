# Voyager Frontend

This is the React frontend for Voyager, a MERN travel planning application.

## Current setup

The frontend was created with Vite and uses:

- React
- Vite
- React Router
- MUI
- Emotion
- Vitest
- React Testing Library
- jsdom

## Requirements

- Node.js
- npm
- Voyager backend running locally

## Environment variables

Create a `.env` file in the `frontend/` folder using `.env.example` as a guide.

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Run the frontend

```bash
npm install
npm run dev
```

## Run tests

```bash
npm run test
```

For a single non-watch test run:

```bash
npm run test:run
```

## Build

```bash
npm run build
```