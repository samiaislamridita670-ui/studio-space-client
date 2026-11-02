# StudioSpace Testing Checklist

## Frontend Checks

- [ ] Homepage loads successfully.
- [ ] Navigation works on desktop and mobile.
- [ ] Registration and login work.
- [ ] Invalid form inputs show useful feedback.
- [ ] Studio listing and details load correctly.
- [ ] Dashboard displays the appropriate user information.
- [ ] My Listings displays the user's studios.
- [ ] My Bookings displays the user's bookings.
- [ ] Theme toggle works.
- [ ] Custom not-found page works.

## Booking Checks

- [ ] Authenticated users can submit valid bookings.
- [ ] Unauthenticated users cannot create bookings.
- [ ] Invalid booking data is rejected.
- [ ] Conflicting bookings are rejected.
- [ ] Users cannot cancel another user's booking.
- [ ] Booking status is displayed correctly.

## Backend Checks

Run:

npm test

Also verify JavaScript syntax where applicable:

node --check server.js

## Production Checks

- [ ] Frontend production build succeeds.
- [ ] Backend health endpoint responds.
- [ ] Database connection is available.
- [ ] Production authentication works.
- [ ] Important workflows work after deployment.

Record actual test results before final submission.
