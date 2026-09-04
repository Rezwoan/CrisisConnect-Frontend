# Final Project Plans

CrisisConnect is graded per person, not per team. Each of the four roles
(NGO, Admin, Volunteer, Donor) is a separate frontend, built by a different
teammate against their own slice of the backend, and each one must
independently satisfy the same rubric:

- 12+ Axios calls, rendered with CSR or SSR depending on the scenario (25 marks)
- Proper layout using components + Tailwind CSS (10 marks)
- Different routing: folder-based, dynamic, and route files like `loading`
  and `not-found` (10 marks)
- Frontend data validation and authentication (10 marks)
- PusherJS real-time notification (bonus, 5 marks — optional, see each plan)
- Class add-ons repeated in every plan: at least 3 CSR and 3 SSR pages, Axios
  only (no `fetch`), a Navbar + Card + Carousel somewhere, role-based
  register/login.

Open your own folder — `ngo/`, `admin/`, `volunteer/`, or `donor/` — for your
plan. Read only your own; you don't need the others to do your part. None of
these plans say anything about colors, spacing, or Tailwind class choices —
that's entirely up to whoever builds the page.

Backend routes referenced below live in `CrisisConnect-Backend`, on its
`main` branch — that's the branch with everyone's actual merged backend
work (the individually-named `admin`/`volunteer`/`donor`/`ngo`/`dev`
branches over there are stale snapshots from before each PR merged).

## Ground rule that applies to all four

Every non-auth route in the backend is currently guarded (`Authorization:
Bearer <token>` required) — that's how it demonstrates authentication for
the backend's own grading. But a Server Component (used for SSR) runs on the
server and can't read `localStorage`, so it can never attach that header —
there is no `fetch`/cookie-based session in this project, on purpose, to
avoid pulling in Next.js middleware (not taught).

The fix used in every plan below is the same one line each role needs:
**unguard exactly one existing "browse" GET route** on the backend so it
returns data to anyone, logged in or not. That route becomes the one SSR
data source (home teaser, list page, and dynamic detail page all read it).
Every other route — profile, create, update, approve, delete, anything
personal or mutating — stays guarded and is called from the browser after
login, with the JWT read out of `localStorage` and sent as `Authorization:
Bearer <token>` on that one Axios call. This is exactly the pattern already
working end-to-end in the NGO frontend (this repo's `ngo` branch).

## Unified login/registration + OTP

The faculty asked for one shared login and one shared registration entry
point across all four roles, and for OTP to stay in on every role (not
removed). That's now built on `main` of this frontend repo:

- **`app/login/page.tsx`** (shared, already built) — a single email +
  password form for everyone. On submit it calls `GET /auth/role?email=...`
  on the backend (a new small shared endpoint that looks the email up in
  the `user` table and returns its `role`), then posts `{ email, password }`
  straight to that role's own `POST /<role>/login`. On success it stores
  `email` in `localStorage` and redirects to `/<role>/login` — your role's
  own folder — to finish the OTP step.
- **`app/register/page.tsx`** (shared, already built) — no form, just three
  links: NGO, Volunteer, Donor. Admin is deliberately not offered here —
  admins are created by an existing admin, not self-registered. Each link
  goes straight to `/<role>/register`.

**What you build in your own role folder**, using OTP exactly the way your
backend already does it (Admin and Volunteer already have this; NGO's is
restored; Donor needs to add it when building the backend from scratch —
see your plan):

- `app/<role>/register/page.tsx` — the real signup form for your role's
  fields, posting to `POST /<role>/signup`. On success, store the email and
  send the user to an OTP-entry page for signup (`POST /<role>/verify-otp`),
  then on to `/login`.
- `app/<role>/login/page.tsx` — the continuation after the shared `/login`
  page already checked the password. Read `email` back out of
  `localStorage` (redirect to `/login` if it's missing — someone landed here
  directly), show a code field, and post to `POST /<role>/verify-login-otp`.
  On success store the returned `accessToken` and go to your dashboard.

NGO's version of both is already built (`app/ngo/register`,
`app/ngo/verify-signup`, `app/ngo/login`) — copy that shape for your own
role's fields and routes. Placeholder folders already exist for
Admin/Volunteer/Donor (`app/<role>/register`, `app/<role>/login`) so the
routes exist; fill them in following the same pattern.

## Ground rule about guarded routes still applies

Everything above only covers auth. Once logged in, every other guarded
route (profile, create, update, etc.) still needs `Authorization: Bearer
<token>` read from `localStorage`, same as before — see the "Ground rule"
section above for why one browse route per role needs to stay public for
SSR to work at all.
