# Voyager

## API Structure

### Authentication

#### POST `/auth/register`
- Registers a new user account.
- Auth required: No

#### POST `/auth/login`
- Authenticates a user and returns a JWT.
- Auth required: No

#### GET `/auth/me`
- Returns the currently authenticated user.
- Auth required: Yes

### Trips

#### POST `/trips`
- Creates a new trip for the authenticated user.
- Used in trip creation form.
- Auth required: Yes

#### GET `/trips`
- Returns all trips for the authenticated user.
- Used in dashboard view.
- Supports optional filtering by trip status (e.g., `?status=booked`).
- Auth required: Yes

#### GET `/trips/:tripId`
- Returns one specific trip.
- Used when opening to an individual trip page.
- Auth required: Yes

#### PATCH `/trips/:tripId`
- Updates an existing trip.
- Used in trip edit form.
- Auth required: Yes

#### DELETE `/trips/:tripId`
- Deletes an existing trip.
- Used in trip edit form.
- Auth required: Yes

### Trip Items

#### POST `/trips/:tripId/items`
- Creates a new TripItem inside a specific trip.
- Used in trip item creation form.
- Auth required: Yes

#### GET `/trips/:tripId/items`
- Returns all TripItems for a specific trip in chronological order.
- Used in the individual trip view.
- Supports optional filtering by trip item type (e.g., `?type=flight`) or trip item status (e.g., `?status=booked`).
- Auth required: Yes

#### GET `/trip-items/:tripItemId`
- Returns one specific TripItem.
- Used when opening a TripItem directly for editing or viewing.
- Auth required: Yes

#### PATCH `/trip-items/:tripItemId`
- Updates one TripItem.
- Used in trip item edit form.
- Auth required: Yes

#### DELETE `/trip-items/:tripItemId`
- Deletes one TripItem.
- Used in trip item edit form.
- Auth required: Yes

### PDF Itinerary Export

POST `/trips/:tripId/export/itinerary`
- Generates a downloadable PDF copy of the trip's itinerary.
- Used in the individual trip view.
- Auth required: Yes

## Application Pages

### Public Pages

#### Landing Page
- Purpose: Introduces the application and links to sign up / login.
- API endpoints used: None

#### Sign Up Page
- Purpose: Allows a new user to create an account.
- API endpoints used:
  - POST `/auth/register`

#### Login Page
- Purpose: Allows an existing user to log in.
- API endpoints used:
  - POST `/auth/login`

### Authenticated Pages

#### Dashboard
- Purpose: Displays the authenticated user’s trips.
- API endpoints used:
  - GET `/auth/me`
  - GET `/trips`

#### Trip Page
- Purpose: Displays a trip and its itinerary timeline.
- API endpoints used:
  - GET `/trips/:tripId`
  - GET `/trips/:tripId/items`
  - POST `/trips/:tripId/export/itinerary`

#### Trip Form
- Purpose: Create or edit a trip.
- API endpoints used:
  - POST `/trips`
  - PATCH `/trips/:tripId`

#### Trip Item Form
- Purpose: Create or edit a TripItem.
- API endpoints used:
  - POST `/trips/:tripId/items`
  - GET `/trip-items/:tripItemId`
  - PATCH `/trip-items/:tripItemId`
  - DELETE `/trip-items/:tripItemId`