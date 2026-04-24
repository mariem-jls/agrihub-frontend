# AgriHub Backoffice

Angular 18 backoffice for AgriHub administration. This app is restricted to admins and is the current UI for business-user management, AI review visibility, duplicate-candidate checks, and account access control.

## What This Frontend Currently Does

- runs on `http://localhost:4300`
- uses the Keycloak client `agrilink-backoffice`
- protects admin pages with authentication plus `ADMIN` realm-role checks
- lets admins:
  - list users
  - create business users
  - edit business users
  - lock accounts
  - unlock accounts
  - view AI review status fields in the user list
  - trigger or preview deeper AI review flows through the user service layer

## Current Routing

- `/seller`
  - main admin area
  - guarded by auth and admin-role checks
- `/marketplace`
  - separate lazy-loaded area still present in the app
- `/`
  - redirects to `/seller`

Inside `/seller`, the main routes are:

- `/seller`
  - dashboard
- `/seller/products`
- `/seller/orders`
- `/seller/users`
- `/seller/users/add`
- `/seller/users/edit/:id`

Current guard behavior:

- if a non-admin authenticates through the backoffice flow, the app redirects them to `http://localhost:4200/post-login`
- this avoids a logout loop and hands the session back to the frontoffice flow

## Backend Integration

Configured in [api.config.ts](/C:/Users/Med%20Ghodbane/Desktop/PI_dev/agrihub-frontend-backoffice-main/src/app/core/api.config.ts):

- API base URL: `http://localhost:8080/AgriLink`

Current admin endpoints used by the verified user-management flow:

- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `POST /api/admin/users/{id}/lock`
- `POST /api/admin/users/{id}/unlock`
- `GET /api/admin/users/{id}/ai-review`
- `POST /api/admin/users/{id}/ai-review`
- `POST /api/admin/users/{id}/ai-review/preview`
- `GET /api/admin/users/{id}/duplicate-candidates`

Returned admin user data currently includes:

- mirrored identity fields
- business profile fields
- AI summary fields when available
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
- lock and unlock actions are replaced by a clearer admin message
- the UI no longer treats a missing-Keycloak row as a normal locked account

## Current Form UX

The add-user form uses submit-triggered validation with field-level messages.

Current validation highlights:

- required-field errors are shown under the exact field
- backend validation errors are mapped under the exact field
- password guidance is shown directly in the form
- generic banner errors are kept only for non-field-specific failures

Business fields currently reflected by the backend model:

- `fullName`
- `phone`
- `address`
- `region`
- `organizationName`
- `activityDescription`
- `userType`

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
- manual admin lock and unlock
  - triggered from this backoffice
  - enforced in Keycloak through the backend

Project rule:

- Keycloak is the source of truth for whether a user can authenticate
- the backoffice is the admin control surface

## Current Scope And Limitations

The user-management path is the most current and most clearly wired backend integration in this app.

Important limitation:

- this app still contains seller product, order, and marketplace modules
- those modules call marketplace-style backend URLs, but the currently inspected backend controller layer is centered on profile, admin, AI review, and sync flows
- treat those marketplace modules as legacy or not currently verified unless the backend is extended separately

## Dependencies

Main dependencies:

- Angular `18.2.x`
- `keycloak-js`
- RxJS
- TypeScript

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
- frontoffice on `http://localhost:4200` if you want to test admin and non-admin handoff

## Verification

Verified locally according to the current project notes:

- focused Angular user-form and user-list tests passed
- backoffice TypeScript checks passed
- the sync and user-creation fix is confirmed working with manual testing

Manual result of the latest verified flow:

- creating a user from backoffice results in one real Keycloak user
- the local `user_profiles` row is enriched correctly
- the older partial-create and orphan scenario is resolved for the tested flow

## Known Notes

- this app still contains marketplace-related modules that are not the main verified integration path today
- URLs and Keycloak settings are hardcoded rather than environment-driven
- Angular production build was previously noted as having unrelated CSS budget failures in other modules
