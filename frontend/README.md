# Voyager Frontend

Voyager is a MERN travel planning application. This folder contains the React frontend for the Voyager project.

## Technologies Used

| Technology | Purpose in this project | Industry relevance | Alternative considered | Licence |
| --- | --- | --- | --- | --- |
| React | Builds the frontend user interface with reusable components. | React is widely used in modern frontend development and is a strong fit for interactive single-page applications. | Vue, Angular, or plain JavaScript could also be used, but React was chosen because it supports reusable component patterns and fits well with a MERN-style application. | MIT |
| Vite | Provides the development server, build tooling, and hot module replacement. | Vite is a modern frontend build tool commonly used because it is fast and simple to configure. | Create React App or Webpack could be used, but Vite is faster and more modern for this project. | MIT |
| JavaScript | Main programming language for the frontend. | JavaScript is the standard language for browser-based web applications and is essential for frontend development. | TypeScript could be used, but JavaScript was chosen to keep the project lightweight and focused while still supporting modern frontend patterns. | ECMAScript standard |
| React Router | Handles frontend page routing. | React Router is commonly used in React applications for client-side navigation. | Manual conditional rendering could be used, but React Router provides clearer route structure. | MIT |
| MUI | Provides reusable UI components and theming. | MUI is widely used in professional React applications and supports a design-system style of development. | Plain CSS, Bootstrap, or Tailwind could be used, but MUI was chosen to provide accessible components, responsive layout tools, and a consistent design foundation with less custom CSS overhead. | MIT |
| Emotion | Provides the styling engine used by MUI. | Emotion is commonly used with MUI for component-based styling. | CSS Modules or styled-components could be used, but Emotion is part of the standard MUI setup. | MIT |
| Vitest | Runs frontend tests. | Vitest is commonly used with Vite projects and provides fast JavaScript testing. | Jest could be used, but Vitest integrates naturally with Vite. | MIT |
| React Testing Library | Tests React components from the user’s perspective. | React Testing Library is widely used because it encourages behaviour-focused and accessibility-aware tests. | Enzyme or shallow rendering could be used, but React Testing Library better matches user behaviour. | MIT |
| jsdom | Provides a browser-like DOM environment for tests. | jsdom is commonly used for testing browser-based JavaScript in a Node environment. | Cypress or Playwright could be used for browser testing, but jsdom is suitable for this project’s component tests. | MIT |

## Hardware and Software Requirements

This frontend does not require specialised hardware.

Recommended local development requirements:

* A modern laptop or desktop computer.
* At least 8GB RAM.
* Node.js
* npm
* Git
* A modern web browser.
* Voyager backend running locally.

## Environment Variables

Create a `.env` file in the `frontend/` folder using `.env.example` as a guide.

```env
VITE_API_BASE_URL=http://localhost:3000
```

`VITE_API_BASE_URL` stores the base URL for the Voyager backend API.

## Installation and Setup

From the `frontend/` folder, install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend should run at:

```txt
http://localhost:5173
```

## Available Scripts

| Script             | Purpose                                |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Starts the Vite development server.    |
| `npm run build`    | Creates a production build.            |
| `npm run preview`  | Previews the production build locally. |
| `npm run test`     | Runs Vitest in watch mode.             |
| `npm run test:run` | Runs Vitest once.                      |
| `npm run lint`     | Runs ESLint.                           |

## Code Style Guide

This project uses a simple custom JavaScript and React style guide.

Code style conventions:

* Double quotes for strings.
* Semicolons at the end of statements.
* `const` by default.
* `let` only when reassignment is required.
* No `var`.
* camelCase for variables and functions.
* PascalCase for React components.
* Descriptive variable, function, and component names.
* Functional React components.
* Clear comments for important logic or decisions.
* Test files colocated with the file they test where practical.

DRY principles are supported through:

* Shared API request helpers.
* Reusable UI components.
* Shared constants for status/type values.
* Custom hooks for repeated React logic.
* Shared utility functions.
* Shared layout components.

## UI Style Guide

Voyager uses MUI as the main UI component library.

The interface should be:

* Clean.
* Calm.
* Practical.
* Responsive.
* Accessible.
* Easy to scan.
* Professional without being over-designed.

The frontend uses the following UI conventions:

* Consistent spacing.
* Clear page headings.
* Responsive MUI layout components.
* Card or list layouts for trips and itinerary items.
* Forms that work well on mobile and desktop.
* Semantic HTML landmarks such as `header`, `nav`, `main`, and `section`.

Accessibility considerations:

* Use logical heading order.
* Use visible form labels.
* Use clear button and link text.
* Show clear error messages.
* Keep main workflows keyboard accessible.

## Project Structure

```txt
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── test/
│   ├── theme/
│   ├── utils/
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Testing

This project uses Vitest and React Testing Library for frontend testing.

Test setup includes:

* Vitest test runner.
* jsdom test environment.
* React Testing Library.
* jest-dom matchers.

Run tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm run test
```
