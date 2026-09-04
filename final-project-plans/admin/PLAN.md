# Admin — Final Project Plan

Your backend (`src/admin/` in `CrisisConnect-Backend`) is already fully
built: signup, login (with OTP), profile, crisis CRUD, and announcements.
Keep OTP exactly as it is — the faculty wants the unified login flow to end
in an OTP step for every role, so there's nothing to remove here.

Auth pages for this role work like every other role — see the root
`README.md` in this folder for the full shared-flow explanation. In short:
`app/login` and `app/register` (already built, shared) collect
email+password / pick a role and hand off to your folder. What you still
need to build:

- `app/admin/register/page.tsx` — currently a placeholder. **This is not a
  public signup form** — `POST /admin/signup` is guarded now
  (`@UseGuards(AdminGuard)` was added to it, see below), so this page is
  really "create another admin," reachable only once you're logged in as an
  admin. It's not linked from the shared `/register` role picker on
  purpose. The very first admin account has to be seeded directly in the
  database (one `INSERT` into `user` + `admin`, bcrypt hash included) since
  there's no admin yet to create one through the API.
- `app/admin/verify-signup/page.tsx` — after creating an admin, `POST
  /admin/verify-otp` with the code emailed to the new admin.
- `app/admin/login/page.tsx` — currently a placeholder. Continues after the
  shared `/login` page already checked the password: read `email` back out
  of `localStorage`, show a code field, `POST /admin/verify-login-otp`,
  store the returned `accessToken`, go to `/dashboard`.

## Required backend edit 1 — guard signup, admin-only

Already done in `src/admin/admin.controller.ts`: `POST /admin/signup` now
has `@UseGuards(AdminGuard)` on it, matching "admin cannot be registered
directly, only another admin can create one." Nothing left to do here
unless you want to change how `req.user` gets passed through to
`adminService.signup`.

## Required backend edit 2 — unguard one browse route

`GET /admin/crisis` and `GET /admin/crisis/:id` are both behind
`@UseGuards(AdminGuard)` in `src/admin/admin.controller.ts`. Remove the
guard from both. Crisis data is meant to be public safety information
anyway — visitors should be able to see active crises before registering.
Leave every other route (`POST/PUT/PATCH/DELETE crisis`, `announcement`,
`users`, `profile`) guarded exactly as-is.

## Pages to build

| Route | CSR/SSR | Data | Axios call |
|---|---|---|---|
| `/` | SSR | first 3 crises | `GET /admin/crisis` |
| `/admin/register` | CSR | — (only reachable once logged in as an admin) | `POST /admin/signup` |
| `/admin/verify-signup` | CSR | — | `POST /admin/verify-otp` |
| `/admin/login` | CSR | — (shared `/login` already did email+password) | `POST /admin/verify-login-otp` |
| `/dashboard` | CSR | your admin profile | `GET /admin/profile` |
| `/crises` | SSR | all crises (folder-based route) | `GET /admin/crisis` |
| `/crises/loading.tsx` | — | loading UI while the fetch runs | — |
| `/crises/[id]` | SSR | one crisis (dynamic route) | `GET /admin/crisis/:id` |
| `/crises/[id]` → `notFound()` | — | call `notFound()` on a 404 response, which renders `not-found.tsx` | — |
| `/crises/new` | CSR | create-crisis form | `POST /admin/crisis` |
| `/crises/[id]/edit` (or a manage table on `/crises`) | CSR | edit + close buttons | `PUT /admin/crisis/:id`, `PATCH /admin/crisis/:id/status` |
| `/announcements/new` | CSR | create-announcement form | `POST /admin/announcement` |

That's 13 Axios call sites (3 SSR, 10 CSR) — past the 12 minimum with both
counts covered. The shared `/login` page's own two calls (`GET /auth/role`,
`POST /admin/login`) are extra on top of this since they're common code,
not admin-specific. A couple of easy additions if you want more margin:

- Add `/users` — read-only list, `GET /admin/users` (CSR). Realistic for an
  admin dashboard anyway.
- Add a "view announcement" step after creating one: `GET
  /admin/announcement/:id` (CSR), since the create form's response already
  gives you the new id.

`recipientUserIds` on the announcement form is a required, non-empty array
of user ids in the DTO. The simplest form for it is a single text input —
"Recipient user IDs, comma separated" — split on `,` and `.map(Number)`
before sending. That's not a taught pattern from a slide, it's just the
smallest amount of code that turns one text field into an array of numbers;
a real multi-select fed by `GET /admin/users` is a nicer version if you
build the `/users` page above anyway, but isn't required.

## Signup form fields

`email, password, fullName, phone, city, age` — `age` must be an integer
≥ 18 (`CreateAdminDto`).

## Auth + validation

Same shape as NGO: Zod validation on every form, one `error` string per
form, `localStorage` for the token (and whatever identity string you want to
greet with on `/dashboard`), `Authorization: Bearer <token>` attached on
every guarded call.

## Required components (no styling opinions here — just what has to exist)

- A Navbar (shared via `app/layout.tsx`)
- Crisis cards for each list item
- A carousel somewhere reasonable — the home page teaser is the natural fit

## Optional

- `/announcements` list page if you build `GET /admin/announcement` (list) —
  doesn't exist yet, only get-by-id does. Not required.
- PusherJS notification (bonus 5 marks) — e.g. notify when a new crisis is
  declared. Skip unless you want the extra 5 marks and don't mind explaining
  a third-party real-time service.
