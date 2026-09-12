# Voyager

Voyager is a MERN travel planning application for creating trips, managing itinerary items, and exporting trip itineraries as PDFs.

This repository is structured as a monorepo with separate folders for the backend API, frontend web application, and Bruno API testing collection.

## Live Demo

The deployed Voyager application is available at:

https://voyagertravelplanner.vercel.app

The frontend is deployed with Vercel and connects to the deployed backend API on Render.

## Applications

| Folder      | Purpose                                                                                                                                                                                             | Documentation                                    |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `backend/`  | Node.js, Express, MongoDB, and Mongoose REST API with JWT authentication, trip management, itinerary item management, admin support routes, PDF export, database seed scripts, and automated tests. | [Backend README](./backend/README.md)            |
| `frontend/` | React and Vite single-page application that connects to the Voyager backend and allows authenticated users to manage trips and itinerary items through a responsive web interface.                  | [Frontend README](./frontend/README.md)          |
| `bruno/`    | Bruno API request collection for manually testing backend routes during development.                                                                                                                | See the collection files in [`bruno/`](./bruno/) |

## Project Overview

Voyager is built as two standalone applications that work together:

- The backend exposes authenticated REST API routes.
- The frontend consumes those API routes and provides the user interface.
- The Bruno collection supports manual API testing while developing or debugging backend functionality.

The application currently supports:

- User registration and login.
- JWT-authenticated user sessions.
- Trip create, read, update, delete, and status filtering.
- Trip item create, read, update, delete, type filtering, and status filtering.
- PDF itinerary export for authenticated users.
- Admin-only backend routes for support/moderation workflows.
- Automated backend and frontend tests.

## Repository Structure

```txt
voyager/
├── .github/
├── backend/
├── bruno/
├── docs/
├── frontend/
├── .gitignore
├── .nvmrc
├── compose.yaml
└── README.md
```

## Local Development Setup

The backend and frontend are installed and run separately.

### 1. Clone the repository

SSH:

```bash
git clone git@github.com:AmeliaFFF/voyager.git
cd voyager
```

HTTPS:

```bash
git clone https://github.com/AmeliaFFF/voyager.git
cd voyager
```

### 2. Set up the backend

```bash
cd backend
npm install
npm run setup:env
npm run dev:watch
```

The backend runs locally at:

```txt
http://localhost:3000
```

See the [backend README](./backend/README.md) for environment variable details, seed data, API routes, and backend tests.

### 3. Set up the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

```txt
http://localhost:5173
```

See the [frontend README](./frontend/README.md) for frontend environment variables, page routes, testing, style guide, accessibility notes, and responsive design details.

## Environment Files

Each application has its own `.env.example` file. Use these example files as templates to create your own local `.env` files.

| Example file                                     | Purpose                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| [backend/.env.example](./backend/.env.example)   | Backend server port, JWT secret, and MongoDB database connection string. |
| [frontend/.env.example](./frontend/.env.example) | Frontend API base URL used to connect to the backend.                    |

## Containerised Development

Voyager can also be run as a containerised development environment using Docker Compose.

From the repository root:

```bash
docker compose up --build
```

This starts:

- The React frontend using Vite on `http://localhost:5173`
- The Node.js and Express backend on `http://localhost:3000`
- A MongoDB container used by the backend.

The services run on a shared Docker network. The backend connects to MongoDB using the `mongodb` service hostname, while MongoDB data is persisted using a named Docker volume.

The MongoDB service includes a health check, and the backend waits for MongoDB to become healthy before starting.

Stop the containerised development environment with:

```bash
docker compose down
```

### Container Images

The frontend and backend Dockerfiles provide separate targets for development, testing, and production.

The backend production image installs production dependencies only and runs the Express application using Node.js.

The frontend production image uses a multi-stage build. Vite first compiles the React application into static files, which are then served by Nginx. The Nginx configuration includes a fallback to `index.html` so React Router routes continue to work when loaded or refreshed directly.

### Container Testing

Frontend and backend test images can be built using the `test` target in each Dockerfile.

The GitHub Actions workflow automatically builds and runs both test images. Backend integration tests run against a temporary MongoDB service, with the JWT secret supplied securely through GitHub repository secrets.

### CI/CD and Container Registry

The workflow in [.github/workflows/container-ci.yml](./.github/workflows/container-ci.yml) automatically tests Voyager's container images.

After successful tests on `main`, production frontend and backend images are built and published to the GitHub Container Registry (GHCR).

Published images use multiple tags:

```txt
ghcr.io/ameliafff/voyager-frontend:latest
ghcr.io/ameliafff/voyager-frontend:v1.0.0-prod
ghcr.io/ameliafff/voyager-frontend:v1.0.0-prod-<short-sha>

ghcr.io/ameliafff/voyager-backend:latest
ghcr.io/ameliafff/voyager-backend:v1.0.0-prod
ghcr.io/ameliafff/voyager-backend:v1.0.0-prod-<short-sha>
```

The tags identify the application version, production environment, and Git revision, while `latest` provides a convenient reference to the current production image.

## Local Testing

### Backend

Backend tests can be run from the `backend/` folder.

Run the backend test suite:

```bash
npm test
```

Run the backend test suite with a coverage report:

```bash
npm run test:coverage
```

The coverage command runs the tests as well, so both commands do not need to be run.

### Frontend

Frontend tests can be run from the `frontend/` folder.

Run the frontend test suite once:

```bash
npm run test:run
```

Run frontend tests in watch mode:

```bash
npm run test
```

Frontend linting, formatting, and build checks can also be run from the `frontend/` folder:

```bash
npm run lint
npm run format:check
npm run build
```

## API Testing with Bruno

The `bruno/` folder contains a Bruno collection for manually testing Voyager API routes, including:

- Authentication routes.
- Trip routes.
- Trip item routes.
- PDF export route.
- Admin-only routes.

Bruno is useful for checking backend behaviour independently from the frontend.

### Basic Bruno workflow

1. Start the backend server.

```bash
cd backend
npm run dev:watch
```

2. Open the `bruno/` collection in Bruno.

3. Run the `auth/register` request to create a user, or use seeded user details if the database has been seeded.

4. Run the `auth/login` request.

5. Copy the JWT from the login response:

```JSON
{
  "data": {
    "token": "..."
  }
}
```

6. For authenticated requests, add the copied token as a Bearer token in Bruno's Auth tab.

7. Run trip, trip item, export, or admin requests as needed.

Admin-only requests require a JWT for a user with `isAdmin: true`

## Documentation

More detailed project documentation is available below:

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Containerisation Architecture](./docs/containerisation.md)
