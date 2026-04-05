# AgriHub Backoffice

Angular 18 backoffice for AgriHub administration. This app is restricted to admins and is the current UI for business-user management and account access control.

## What This Frontend Does

- runs on `http://localhost:4300`
- uses the Keycloak client `agrilink-backoffice`
- protects admin pages with authentication plus `ADMIN` realm-role checks
- lets admins:
  - list users
  - create business users
  - edit business users
  - lock accounts
  - unlock accounts

## Current Routing

- `/seller`
  - main admin area
  - guarded by auth and admin-role checks
- `/marketplace`
  - separate lazy-loaded area still present in the app
- `/`
  - redirects to `/seller`

Current guard behavior:

- if a non-admin authenticates through the backoffice flow, the app redirects them to `http://localhost:4200/post-login`
- this avoids the old logout/login loop and hands the session back to the frontoffice correctly

## Backend Integration

Configured in [api.config.ts](/C:/Users/Med%20Ghodbane/Desktop/PI_dev/agrihub-frontend-backoffice-main/src/app/core/api.config.ts):

- API base URL: `http://localhost:8080/AgriLink`

Current user-management endpoints used by the UI:

- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `POST /api/admin/users/{id}/lock`
- `POST /api/admin/users/{id}/unlock`

Returned admin user data currently includes:

- mirrored identity fields
- business profile fields
- `accountEnabled`
- `orphanedInKeycloak`

## Current User-Management Behavior

Verified behavior:

- create business users
- edit business-user business fields
- lock real Keycloak users
- unlock real Keycloak users
- display orphaned local rows distinctly when the Keycloak user is missing

Current orphan behavior:

- an orphan row is shown as missing in Keycloak
- lock / unlock actions are replaced by a clearer admin message
- the UI no longer treats a missing-Keycloak row as just a normal locked account

## Current Form UX

The add-user form now uses submit-triggered field validation with field-level messages.

Current validation highlights:

- required-field errors are shown under the exact field
- backend validation errors are mapped under the exact field
- password guidance is shown directly in the form
- generic banner errors are kept only for non-field-specific failures

Temporary password expectations shown by the UI:

- at least 8 characters
- uppercase
- lowercase
- number
- special character
- should not match username or email

## Account Locking Behavior

There are two different lock paths in the system:

- temporary brute-force lock
  - enforced by Keycloak after repeated failed logins
- manual admin lock / unlock
  - triggered from this backoffice
  - enforced in Keycloak through the backend

Project rule:

- Keycloak is the source of truth for whether a user can authenticate
- the backoffice is the admin control surface

## Local Development

Start the Angular dev server:

```bash
ng serve --port 4300
```

Open:

- `http://localhost:4300`

For full local behavior, also run:

- backend on `http://localhost:8080/AgriLink`
- Keycloak on `http://localhost:8081`
- frontoffice on `http://localhost:4200` if you want to test admin / non-admin handoff

## Verification

Verified locally:

- focused Angular user-form and user-list tests passed
- backoffice TypeScript checks passed
- the latest sync / user-creation fix is confirmed working with manual testing

Manual result of the latest verified flow:

- creating a user from backoffice now results in one real Keycloak user
- the local `user_profiles` row is enriched correctly
- the previous broken partial-create / orphan scenario is resolved for the tested flow

## Known Notes

- this app still contains marketplace-related modules that are not the main verified integration path today
- Angular production build still has unrelated CSS budget failures in other modules; those are known limitations and not regressions from the user-management fix
