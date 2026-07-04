# Voyager Frontend

Voyager is a MERN travel planning application. This folder contains the React frontend for the Voyager project.

The frontend connects to the Voyager backend API and allows authenticated users to create trips, manage itinerary items, filter travel plans, and export trip itineraries as PDFs.

## Project Purpose

The frontend was designed as the user-facing web application for Voyager.

It supports:

- Auth-aware home page with public calls to action and authenticated trip actions.
- User registration.
- User login and logout.
- Restored authenticated sessions using a saved JWT.
- Protected routes for authenticated users.
- Public-only login and registration routes that redirect authenticated users to their trips.
- Trip create, read, update, delete, and status filtering.
- Trip item create, read, update, delete, type filtering, and status filtering.
- PDF itinerary export from a trip detail page.
- User-friendly validation and error messages.
- Responsive layouts for mobile and desktop screen sizes.

## Technologies Used

| Technology            | Purpose in this project                                                     | Industry relevance                                                                                                                                          | Alternative considered                                                                                                                                                                           | Licence             |
| --------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| JavaScript            | Main programming language for the frontend.                                 | JavaScript is the standard language for browser-based web applications and is essential for frontend development.                                           | TypeScript could be used, but JavaScript was chosen to keep the project lightweight and focused while still supporting modern frontend patterns.                                                 | ECMAScript standard |
| React                 | Builds the frontend user interface with reusable components.                | React is widely used in modern frontend development and is a strong fit for interactive single-page applications.                                           | Vue, Angular, or plain JavaScript could also be used, but React was chosen because it supports reusable component patterns and fits well with a MERN-style application.                          | MIT                 |
| React Router          | Handles frontend page routing and protected route structure.                | React Router is commonly used in React applications for client-side navigation.                                                                             | Manual conditional rendering could be used, but React Router provides clearer route structure.                                                                                                   | MIT                 |
| Vite                  | Provides the development server, build tooling, and hot module replacement. | Vite is a modern frontend build tool commonly used because it is fast and simple to configure.                                                              | Create React App or Webpack could be used, but Vite is faster and more modern for this project.                                                                                                  | MIT                 |
| MUI                   | Provides reusable UI components and theming.                                | MUI is widely used in professional React applications and supports a design-system style of development.                                                    | Plain CSS, Bootstrap, or Tailwind could be used, but MUI was chosen to provide accessible components, responsive layout tools, and a consistent design foundation with less custom CSS overhead. | MIT                 |
| Emotion               | Provides the styling engine used by MUI.                                    | Emotion is commonly used with MUI for component-based styling.                                                                                              | CSS Modules or styled-components could be used, but Emotion is part of the standard MUI setup.                                                                                                   | MIT                 |
| Fontsource Inter      | Provides the Inter font as a local npm package.                             | Self-hosted web fonts are common in frontend projects because they give the app consistent typography without depending on an external font CDN at runtime. | Google Fonts CDN or system fonts could be used, but Fontsource keeps the font managed through npm with the rest of the project dependencies.                                                     | MIT                 |
| ESLint                | Checks frontend code for common JavaScript and React issues.                | ESLint is widely used in JavaScript projects to help catch errors and keep code quality consistent.                                                         | Manual review alone could be used, but ESLint gives faster and more repeatable feedback.                                                                                                         | MIT                 |
| Prettier              | Formats frontend code consistently.                                         | Prettier is commonly used in professional JavaScript projects to reduce formatting inconsistencies and code review noise.                                   | Manual formatting or ESLint-only formatting could be used, but Prettier provides clearer automatic formatting.                                                                                   | MIT                 |
| Vitest                | Runs frontend tests.                                                        | Vitest is commonly used with Vite projects and provides fast JavaScript testing.                                                                            | Jest could be used, but Vitest integrates naturally with Vite.                                                                                                                                   | MIT                 |
| React Testing Library | Tests React components from the user’s perspective.                         | React Testing Library is widely used because it encourages behaviour-focused and accessibility-aware tests.                                                 | Enzyme or shallow rendering could be used, but React Testing Library better matches user behaviour.                                                                                              | MIT                 |
| jsdom                 | Provides a browser-like DOM environment for tests.                          | jsdom is commonly used for testing browser-based JavaScript in a Node environment.                                                                          | Cypress or Playwright could be used for browser testing, but jsdom is suitable for this project’s component tests.                                                                               | MIT                 |

## Hardware and Software Requirements

This frontend does not require specialised hardware.

Recommended local development requirements:

- A modern laptop or desktop computer.
- At least 8GB RAM.
- Node.js
- npm
- Git
- A modern web browser.
- Voyager backend running locally.

## Environment Variables

Create a `.env` file in the `frontend/` folder using `.env.example` as a guide.

```env
VITE_API_BASE_URL=http://localhost:3000
```

`VITE_API_BASE_URL` stores the base URL for the Voyager backend API.

## Installation and Setup

The Voyager backend should be installed, configured, and running before using the frontend.

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

| Script                 | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server.                        |
| `npm run build`        | Creates a production build.                                |
| `npm run preview`      | Previews the production build locally.                     |
| `npm run test`         | Runs Vitest in watch mode.                                 |
| `npm run test:run`     | Runs Vitest once.                                          |
| `npm run lint`         | Runs ESLint.                                               |
| `npm run format`       | Formats frontend files with Prettier.                      |
| `npm run format:check` | Checks whether frontend files are formatted with Prettier. |

## Code Style Guide

This project uses a simple custom JavaScript and React style guide.

Code style conventions:

- ES module imports and exports.
- Double quotes for strings.
- Semicolons at the end of statements.
- `const` by default.
- `let` only when reassignment is required.
- No `var`
- camelCase for variables and functions.
- PascalCase for React components.
- Descriptive variable, function, and component names.
- Functional React components.
- Clear comments for important logic or decisions.
- Test files colocated with the file they test where practical.

DRY principles are supported through:

- Shared API request helpers.
- Reusable UI components.
- Shared constants for status and type values.
- Custom hooks for repeated React logic.
- Shared utility functions.
- Shared validation functions.
- Shared layout components.
- Shared theme configuration.

## UI Style Guide

Voyager uses MUI as the main UI component library and a custom MUI theme for project-specific styling.

Typography uses the Inter font, loaded through Fontsource, with fallback fonts defined in the MUI theme.

The interface should be:

- Clean.
- Calm.
- Practical.
- Responsive.
- Accessible.
- Easy to scan.
- Professional without being over-designed.

The frontend uses the following UI conventions:

- Consistent spacing.
- Clear page headings.
- Responsive MUI layout components.
- Card or list layouts for trips and itinerary items.
- Forms that work well on mobile and desktop.
- Clear primary and secondary actions.
- Semantic HTML landmarks such as `header`, `nav`, `main`, and `section`.

Accessibility considerations:

- Use logical heading order.
- Use visible form labels.
- Use clear button and link text.
- Show clear error messages.
- Use `role="alert"` for feedback messages that should be announced.
- Keep main workflows keyboard accessible.

## Responsive Design

The frontend uses MUI responsive style props and layout components so pages can adapt across different screen sizes.

Responsive design examples include:

- Mobile-first stacked layouts for page actions and forms.
- Wider multi-column layouts on larger screens where appropriate.
- Full-width form controls and buttons on small screens.
- Grid-based trip cards that display as one column on small screens and two columns on larger screens.
- Trip and itinerary detail sections that keep labels and values readable across mobile and desktop widths.

## Application Routes

| Route                                   | Access      | Purpose                                                                                    |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `/`                                     | Public      | Home page with application introduction and navigation to register or log in.              |
| `/register`                             | Public only | Register a new user account. Redirects authenticated users to `/trips`                     |
| `/login`                                | Public only | Log in to an existing account. Redirects authenticated users to `/trips`                   |
| `/trips`                                | Protected   | View the authenticated user's trips and filter them by status.                             |
| `/trips/new`                            | Protected   | Create a new trip.                                                                         |
| `/trips/:tripId`                        | Protected   | View one trip, manage itinerary items, filter itinerary items, and export a PDF itinerary. |
| `/trips/:tripId/edit`                   | Protected   | Edit or delete one trip.                                                                   |
| `/trips/:tripId/items/new`              | Protected   | Create a new itinerary item for a trip.                                                    |
| `/trips/:tripId/items/:tripItemId/edit` | Protected   | Edit or delete one itinerary item.                                                         |
| `*`                                     | Public      | Not found page for unmatched routes.                                                       |

## Project Structure

```txt
frontend/
├── public/
│   ├── voyager-icon.svg
│   ├── voyager-logo-dark.svg
│   └── voyager-logo-light.svg
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── authApi.js
│   │   ├── exportApi.js
│   │   ├── tripItemsApi.js
│   │   └── tripsApi.js
│   ├── components/
│   │   ├── ContentCard.jsx
│   │   ├── FeedbackMessage.jsx
│   │   ├── FeedbackMessage.test.jsx
│   │   ├── TripCard.jsx
│   │   ├── TripCard.test.jsx
│   │   ├── TripForm.jsx
│   │   ├── TripForm.test.jsx
│   │   ├── TripItemCard.jsx
│   │   ├── TripItemCard.test.jsx
│   │   ├── TripItemForm.jsx
│   │   └── TripItemForm.test.jsx
│   ├── constants/
│   │   ├── tripConstants.js
│   │   └── tripItemConstants.js
│   ├── context/
│   │   ├── authContext.js
│   │   └── AuthProvider.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── layouts/
│   │   └── AppLayout.jsx
│   ├── pages/
│   │   ├── EditTripItemPage.jsx
│   │   ├── EditTripPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── HomePage.test.jsx
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.test.jsx
│   │   ├── NewTripItemPage.jsx
│   │   ├── NewTripPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── NotFoundPage.test.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RegisterPage.test.jsx
│   │   ├── TripDetailPage.jsx
│   │   └── TripsPage.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProtectedRoute.test.jsx
│   │   └── PublicOnlyRoute.jsx
│   ├── test/
│   │   ├── setup.js
│   │   └── testUtils.jsx
│   ├── theme/
│   │   └── theme.js
│   ├── utils/
│   │   ├── authValidation.js
│   │   ├── authValidation.test.js
│   │   ├── errorUtils.js
│   │   ├── errorUtils.test.js
│   │   ├── statusUtils.js
│   │   ├── statusUtils.test.js
│   │   ├── tokenStorage.js
│   │   ├── tokenStorage.test.js
│   │   ├── tripItemUtils.js
│   │   ├── tripItemUtils.test.js
│   │   ├── tripItemValidation.js
│   │   ├── tripItemValidation.test.js
│   │   ├── tripValidation.js
│   │   └── tripValidation.test.js
│   ├── App.jsx
│   ├── App.test.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## API Integration

The frontend connects to the backend using shared API helper functions in `src/api/`

API integration is centralised so pages and components do not need to repeat:

- Base URL handling.
- JSON request formatting.
- Authorization headers.
- Response parsing.
- Backend error message handling.
- Network error fallback messages.
- Blob/file download requests for PDF export.

Authentication state is managed through React context in `AuthProvider`. The token is saved to local storage and validated against the backend when the app loads so a saved session can be restored.

## Error Handling

The frontend handles common error cases, including:

- Missing or invalid form fields.
- Invalid login or registration details.
- Failed authenticated API requests.
- Missing or invalid saved authentication tokens.
- Network connection failures.
- Backend validation errors.
- Missing or not found trips and trip items.
- Failed PDF export requests.

Error handling is supported by:

- Shared API request helpers.
- Shared `getErrorMessage` utility.
- Reusable `FeedbackMessage` component.
- Inline form validation before API requests.
- Defensive fallbacks when optional response data is missing.

## Testing

This project uses Vitest and React Testing Library for frontend testing.

Test setup includes:

- Vitest test runner.
- jsdom test environment.
- React Testing Library.
- jest-dom matchers.

Run tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm run test
```

## Future Improvements

Future improvements include:

- Frontend admin dashboard for the existing backend admin API routes.
- More advanced search and sorting options.
- Additional loading, empty-state, and error-state polish.
- More async page-level tests for API-driven pages.
- Browser-based end-to-end tests using a tool such as Playwright or Cypress.
