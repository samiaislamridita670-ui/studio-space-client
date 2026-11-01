# StudioSpace — Creative Studio Booking Platform

StudioSpace is a web-based creative studio booking platform that connects studio owners with people looking for creative spaces. Users can explore studios, view details, manage listings, and book studios for their creative projects.

**Live Website:** Coming Soon

**Frontend Repository:** https://github.com/samiaislamridita670-ui/studio-space-client

**Backend Repository:** https://github.com/samiaislamridita670-ui/studio-space-server

## Key Features

* User registration and login with email and password.
* Google authentication support.
* Explore available creative studios.
* Search and filter studios by category.
* View detailed studio information.
* Add new studio listings.
* Update and delete personal studio listings.
* Book available studios.
* View personal booking history.
* Cancel pending bookings.
* Prevent double booking when a studio has a confirmed booking.
* Protected routes and authenticated API operations.
* Responsive design for desktop, tablet, and mobile devices.
* Toast notifications for user feedback.

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* Better Auth
* Sonner
* Lucide React
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* JSON Web Token (JWT)
* bcrypt

## Installation and Setup

### Prerequisites

* Node.js
* npm
* Git
* MongoDB database

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/samiaislamridita670-ui/studio-space-client.git
```

### 2. Navigate to the Project

```bash
cd studio-space-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the frontend root directory.

Add your own credentials:

```env
BACKEND_URL=http://localhost:5000

BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

INTERNAL_API_SECRET=your_shared_internal_api_secret
```

**Important:** Never upload environment files or secret credentials to GitHub.

### 5. Run the Frontend

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Backend Setup

Clone the backend repository:

```bash
git clone https://github.com/samiaislamridita670-ui/studio-space-server.git
```

Navigate to the backend directory:

```bash
cd studio-space-server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
INTERNAL_API_SECRET=your_shared_internal_api_secret
```

Run the backend:

```bash
npm run dev
```

Backend API:

http://localhost:5000

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build the application    |
| `npm run start` | Start production server  |

## Security

* Protected API operations require authentication.
* Internal API requests use a shared secret.
* Studio owners can manage only their own listings.
* Booking operations use authenticated user information.
* Environment variables are not included in public source code.

## Examiner Credentials

Demo examiner credentials will be added after deployment and test-account creation.

An examiner can currently register a new account through the registration page.

## Author

**Samia Islam Ridita**

CSE Undergraduate Student
Green University of Bangladesh
Dhaka, Bangladesh

GitHub: https://github.com/samiaislamridita670-ui

---

*StudioSpace — Find Your Creative Space.*
