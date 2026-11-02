# StudioSpace Architecture and Security Notes

## Application Structure

StudioSpace is a creative studio booking platform.

The application contains:

- Next.js frontend
- Express backend API
- MongoDB database
- Better Auth integration
- User authentication and protected application features
- Studio management
- Booking management

## Main Frontend Pages

- /
- /register
- /login
- /dashboard
- /studios
- /add-studio
- /my-listings
- /my-bookings

## Authentication and Security

- Authentication is required for protected operations.
- Authentication cookies use HTTP-only settings.
- Passwords are hashed before storage by the backend authentication flow.
- Studio management operations enforce ownership checks.
- Booking operations validate the requesting user.
- Internal requests use shared-secret verification.

## Development Principles

- Keep secrets in environment variables.
- Validate incoming data.
- Return appropriate errors for invalid or unauthorized requests.
- Avoid exposing private user information.
- Test changes before deployment.
