# NGO — Final Project Plan

Your backend (`src/ngo/` in `CrisisConnect-Backend`) is already fully built,
OTP included: `signup → verify-otp` and `login → verify-login-otp`. You do
not need to touch the auth logic at all.

Auth pages are already built for this role as part of the shared flow
(`app/login`, `app/register` are the shared entry points; `app/ngo/register`,
`app/ngo/verify-signup`, `app/ngo/login` are this role's continuation
pages) — see the root `README.md` in this folder for how the pieces fit
together. Nothing else in this plan changes because of that.

## The one backend change you need

`GET /ngo/crisis` is currently guarded (`@UseGuards(NgoGuard)` in
`src/ngo/ngo.controller.ts`). Remove that one decorator so browsing crises
needs no token. Everything else in the file — `join`, `leave`, `my-crises`,
`volunteer-call`, `donation-call`, `application`, `assignment`, `profile` —
stays guarded exactly as it is. This one change is what makes real
server-side rendering possible (see the root `README.md` in this folder for
why).

## Pages to build

All routes below live under `app/ngo/` (own-folder-only — see the root
`README.md`), so the SSR home teaser is `/ngo`, not the app's root `/`. The
root `/` stays the shared login/register gateway, untouched by this plan.

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/ngo` | SSR | first 3 active crises | `GET /ngo/crisis` |
| `/ngo/register` | CSR | — | `POST /ngo/signup` |
| `/ngo/verify-signup` | CSR | — | `POST /ngo/verify-otp` |
| `/ngo/login` | CSR | — (shared `/login` already did email+password) | `POST /ngo/verify-login-otp` |
| `/ngo/dashboard` | CSR | your org profile | `GET /ngo/profile` |
| `/ngo/crises` | SSR | all crises (folder-based route) | `GET /ngo/crisis` |
| `/ngo/crises/loading.tsx` | — | Next.js loading UI while the above fetch runs | — |
| `/ngo/crises/[id]` | SSR | one crisis (dynamic route) | reuses the same `GET /ngo/crisis` list, find by id server-side |
| `/ngo/crises/[id]` → `notFound()` | — | call `notFound()` from `next/navigation` when the id isn't in the list, which renders `not-found.tsx` | — |
| `/ngo/crises/[id]` "Join" button | CSR (client component nested in the SSR page) | — | `POST /ngo/crisis/:id/join` |
| `/ngo/my-crises` | CSR | crises you've joined + a "Leave" button | `GET /ngo/my-crises`, `DELETE /ngo/crisis/:id/leave` |
| `/ngo/calls` | CSR | your volunteer calls, a create form, a close button | `GET /ngo/volunteer-call`, `POST /ngo/volunteer-call`, `PATCH /ngo/volunteer-call/:id/status` |
| `/ngo/donation-calls` | CSR | your donation calls + create form | `GET /ngo/donation-call`, `POST /ngo/donation-call` |

Built: all rows above, plus a `layout.tsx` and `_components/` (Navbar,
CrisisCard, Carousel) inside `app/ngo/` for the shared-within-this-role UI
the table doesn't itemize on its own.

That's 15 Axios call sites (3 SSR — home teaser, crisis list, crisis detail
— and 12 CSR), well past the 12 minimum with both counts covered. The
shared `/login` page's own two calls (`GET /auth/role`, `POST /ngo/login`)
are extra on top of this table since they're common code, not NGO-specific.

## Auth + validation

Already built — Zod for form validation, one `error` string per form,
`localStorage.setItem("email", ...)` on both the shared login and NGO's own
register/verify steps, `localStorage.setItem("token", ...)` once
`/ngo/login` finishes at `/ngo/login` (the OTP step), read back with
`useEffect` on `/ngo/dashboard`. Every guarded call from a Client Component
sends `Authorization: Bearer <token>` read from `localStorage`.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared across all pages via `app/layout.tsx`)
- Crisis / call cards for each list item
- A carousel somewhere reasonable — the home page teaser (3 crises) is the
  natural fit

## Optional

- `/assignment` — read-only list, `GET /ngo/assignment` (CSR). Nice extra
  margin above 12 if you want it; not required.
- PusherJS notification (bonus 5 marks) — e.g. notify when a volunteer
  applies to one of your calls. Skip unless you specifically want to take on
  a third-party real-time service and explain it; nothing above depends on
  it.
