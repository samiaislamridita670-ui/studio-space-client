# StudioSpace Deployment Guide

## Production URLs

- Frontend: https://studio-space-client-orpin.vercel.app
- Backend: https://studio-space-server-jbg6.vercel.app

## Frontend Environment Variables

Configure these variables in the frontend deployment settings:

- NEXT_PUBLIC_BETTER_AUTH_URL
- BETTER_AUTH_URL
- BACKEND_URL

Use the production frontend URL for the Better Auth URL variables and the deployed backend URL for BACKEND_URL.

## Backend Configuration

Configure the required MongoDB connection and authentication secrets in the backend deployment environment.

Never commit .env files, passwords, API secrets, or private credentials.

## Deployment Checklist

1. Install dependencies.
2. Configure environment variables.
3. Run npm run build in the frontend.
4. Run backend tests.
5. Deploy frontend and backend.
6. Verify the backend health endpoint.
7. Test registration, login, studio listing, and booking workflows.
