# Donor — Final Project Plan

Unlike the other three roles, `src/donor/` in `CrisisConnect-Backend` is
still just the starter stub (`GET /donor` health check only) — the entities
(`Donor`, `Donation`, `Payment`, `Receipt`) exist, but no real routes yet.
Build it with OTP included from the start — the faculty wants the unified
login flow to end in an OTP step for every role, and NGO's `src/ngo/`
already shows exactly how to wire that up (shared `Otp` entity,
`OtpPurpose` enum, `MailerService`).

## Backend routes to build (minimum)

Copy the shape of `src/ngo/ngo.service.ts` and `src/ngo/ngo.guard.ts` —
same project, already working, OTP included. `DonorGuard` should be an
exact copy of `NgoGuard` with `UserRole.NGO` swapped for `UserRole.DONOR`.

| Verb | Route | Guarded? | Body / notes |
|---|---|---|---|
| POST | `/donor/signup` | no | `{ email, password, fullName, city, country?, uniqueId }` — see below. Creates the account unverified and emails a signup code, exactly like `NgoService.signup()`. |
| POST | `/donor/verify-otp` | no | `{ email, code }` — marks the account verified, same as `NgoService.verifyOtp()`. |
| POST | `/donor/login` | no | `{ email, password }` — checks password + `isVerified`, then emails a login code (no token yet), same as `NgoService.login()`. |
| POST | `/donor/verify-login-otp` | no | `{ email, code }` → `{ accessToken }`, same as `NgoService.verifyLoginOtp()`. |
| GET | `/donor/profile` | yes | identity from the token, like NGO's `/ngo/profile` |
| PUT | `/donor/profile` | yes | `{ fullName, city, country }` |
| PATCH | `/donor/profile/country` | yes | `{ country }` |
| GET | `/donor/donation-call` | **no** | reads NGO's `DonationCall` entity — register it in `donor.module.ts`'s `forFeature`, same way NGO reads Admin's `Crisis`. Public on purpose — see the root `README.md` in this folder. Optional filters: `?status=`, `?crisisId=` |
| POST | `/donor/donation` | yes | `{ donationCallId, amount, message }` → creates a `Donation` row, `status: "INITIATED"` |
| GET | `/donor/donation` | yes | your own donations only (scope by the token's `userId`, same as every other role's "my own records" routes) |
| DELETE | `/donor/donation/:id` | yes | only if still `INITIATED` — otherwise 400/404, same pattern as NGO's ownership checks |
| GET | `/donor` | **no** | list donors — `fullName, city, country, joiningDate` only, never the linked `user` row. Optional filters: `?country=`, `?city=` |

`uniqueId` on signup: treat it like Volunteer's `username` — a donor-chosen
public identifier, required and unique, checked the same way email
uniqueness is checked in `NgoService.signup()`.

`amount` is a `decimal` column — Postgres returns it as a string, so keep it
typed as `string` on the entity and DTO, same note already in the backend
repo's `AGENTS.md` under "Known TypeORM gotchas."

Skip entirely for now (see Optional below): `Payment`, `Receipt`, and the
`crisis_follow` M:N (follow/unfollow a crisis). None of them are needed to
hit the numbers below.

Auth pages for this role work like every other role — see the root
`README.md` in this folder for the full shared-flow explanation. In short,
`app/login` and `app/register` (already built, shared) collect
email+password / pick a role and hand off to your folder. What you still
need to build (placeholders already exist at these paths):

- `app/donor/register/page.tsx` — the real signup form (fields below),
  posting to `POST /donor/signup`. On success, store the email and send the
  user to an OTP-entry page that posts to `POST /donor/verify-otp`, then on
  to `/login`.
- `app/donor/login/page.tsx` — continues after the shared `/login` page
  already checked the password: read `email` back out of `localStorage`,
  show a code field, `POST /donor/verify-login-otp`, store the returned
  `accessToken`, go to `/dashboard`.

## Pages to build

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/` | SSR | first 3 open campaigns | `GET /donor/donation-call` |
| `/donor/register` | CSR | — | `POST /donor/signup` |
| `/donor/verify-signup` | CSR | — | `POST /donor/verify-otp` |
| `/donor/login` | CSR | — (shared `/login` already did email+password) | `POST /donor/verify-login-otp` |
| `/dashboard` | CSR | your donor profile | `GET /donor/profile` |
| `/campaigns` | SSR | all open campaigns (folder-based route) | `GET /donor/donation-call` |
| `/campaigns/loading.tsx` | — | loading UI while the fetch runs | — |
| `/campaigns/[id]` | SSR | one campaign (dynamic route) | reuses the same `GET /donor/donation-call` list, find by id server-side |
| `/campaigns/[id]` → `notFound()` | — | call `notFound()` when the id isn't in the list, which renders `not-found.tsx` | — |
| `/campaigns/[id]` "Donate" form | CSR (client component nested in the SSR page) | amount + message | `POST /donor/donation` |
| `/donations` | CSR | your donations + a cancel button | `GET /donor/donation`, `DELETE /donor/donation/:id` |
| `/profile/edit` | CSR | edit form + country field | `PUT /donor/profile`, `PATCH /donor/profile/country` |
| `/donors` | SSR | public donor list | `GET /donor` |

That's 14 Axios call sites (4 SSR — home teaser, campaign list, campaign
detail, donor list — and 10 CSR). The shared `/login` page's own two calls
(`GET /auth/role`, `POST /donor/login`) are extra on top of this since
they're common code, not donor-specific.

## Auth + validation

Same shape as NGO: Zod validation on every form, one `error` string per
form, `localStorage` for the token and a display name, `Authorization:
Bearer <token>` attached on every guarded call.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared via `app/layout.tsx`)
- Campaign cards for each list item
- A carousel somewhere reasonable — the home page teaser is the natural fit

## Optional — skip unless you want extra scope

- Payment + Receipt (`POST /donor/donation/:id/pay`, `GET
  /donor/receipt/:id`) — a full 1:1 chain on top of donations. Extra
  entities, extra explaining, no extra marks. Add it only if you want more
  to show.
- Crisis follow/unfollow (`POST/DELETE /donor/crisis/:id/follow`) — a
  many-to-many on top of everything above, same reasoning: nice extra, not
  required.
- PusherJS notification (bonus 5 marks) — e.g. notify the NGO when a
  donation comes in. Skip unless you specifically want the extra 5 marks.
