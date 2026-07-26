# QR Ordering Engine — Project Architecture

> **Document Version:** 2.0  
> **Framework:** Next.js 16 (App Router) | React 19  
> **Database:** Supabase (PostgreSQL)  
> **Deployment Target:** Netlify  
> **Audit Date:** July 2026  

---

## 1. Executive Summary

QR Ordering Engine is a multi-tenant SaaS platform that allows restaurants to manage their entire operation digitally — from QR-code-based ordering at tables, to kitchen display, staff management, billing, attendance, and real-time analytics. Customers scan a QR code at their table, browse the menu, place orders, and request service, all from their phone. Restaurant staff use a dashboard to manage orders, tables, menu items, staff, and operational reports.

The platform is built as a **monolithic Next.js application** using the App Router, with a **domain-driven module architecture** under `src/modules/`. The frontend and backend are co-located in the same Next.js project — **API route handlers** serve as the backend layer, while **React Server Components and Client Components** form the frontend. Authentication is handled by **Supabase SSR**, and all database access goes through **Supabase JS clients** (both anon and service-role). There is no separate backend server, no ORM (no Prisma), and no message queue.

The application has **17 domain modules**, **~80 TypeScript source files** across `src/modules/`, **~30 API route handler files**, and a **single Zustand store** for client-side state.

---

## 2. Business Purpose of the SaaS

The platform solves the following problems for restaurant owners:

| Problem | Solution |
|---|---|
| Customers wait for waiters to take orders | QR-code-based self-ordering from any device |
| Paper menus are static and expensive to reprint | Digital menu that updates in real time |
| Staff coordination is manual and error-prone | Centralized dashboard for orders, tables, and staff |
| Billing and payment tracking is fragmented | Integrated billing with payment transaction logs |
| No insight into operations | Analytics (daily/hourly/item-level) |
| Employee attendance and shift management | Attendance logging and shift configuration |
| Multi-branch / multi-restaurant management | Multi-tenant architecture with domain-based resolution |

---

## 3. Folder-by-Folder Explanation

### Top Level

```
qr-ordering-engine/
├── .next/                    # Next.js build output (auto-generated)
├── public/                   # Static assets (images, sounds)
│   ├── images/               # Uploaded/placeholder images
│   └── sounds/               # Notification sounds
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router: pages and API routes
│   ├── components/           # Shared UI components (shadcn/ui primitives)
│   ├── lib/                  # Shared library code (auth, supabase clients, utilities)
│   ├── modules/              # Domain-driven business logic modules
│   ├── store/                # Zustand state management stores
│   ├── styles/               # Global styles
│   └── utils/                # General utility functions
├── middleware.ts             # Next.js middleware for auth protection
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration (strict mode, @/* path alias)
├── package.json              # Dependencies and scripts
├── components.json           # shadcn/ui configuration
├── netlify.toml              # Netlify deployment configuration
├── postcss.config.mjs        # PostCSS config (Tailwind CSS v4)
└── eslint.config.mjs         # ESLint configuration
```

### `src/app/` — Next.js App Router

This is the entry point for all routes — both pages and API endpoints.

```
src/app/
├── api/                      # Backend API route handlers (REST)
│   ├── dashboard/            # Dashboard-related CRUD endpoints
│   │   ├── attendance/       #   Attendance logs
│   │   │   ├── clock-in/     #     Clock-in route
│   │   │   └── clock-out/    #     Clock-out route
│   │   ├── menu/             #   Menu item CRUD
│   │   ├── notifications/    #   Notifications
│   │   ├── orders/           #   Order management
│   │   │   ├── payment/      #     Payment processing
│   │   │   ├── status/       #     Order status updates
│   │   │   └── available/    #     Available orders
│   │   ├── requests/         #   Customer requests
│   │   ├── sessions/         #   Table session management
│   │   ├── settings/         #   Restaurant settings
│   │   ├── staff/            #   Staff CRUD
│   │   ├── tables/           #   Table management
│   │   └── waiter/           #   Waiter-specific endpoints
│   ├── dev/                  # Development/debug endpoints
│   ├── maps/                 # Map-related endpoints (Leaflet integration)
│   ├── menu/                 # Public menu endpoints (for QR ordering)
│   └── qr/                   # QR code generation endpoints
├── components/               # Client/Server components shared across pages
│   ├── billing/              #   Billing UI components
│   ├── dashboard/            #   Dashboard layout components
│   │   ├── cards/            #     Stat cards
│   │   ├── charts/           #     Charts (via Recharts)
│   │   ├── form/             #     Form components
│   │   ├── header/           #     Dashboard header
│   │   ├── mobile/           #     Mobile-specific (bottom sheet)
│   │   ├── notification/     #     Notification UI
│   │   ├── owner/            #     Owner-specific components
│   │   ├── sections/         #     Dashboard sections
│   │   ├── settings/         #     Settings UI
│   │   ├── sidebar/          #     Dashboard sidebar navigation
│   │   ├── staff/            #     Staff UI components
│   │   └── ui/               #     Generic dashboard UI elements
│   ├── orders/               #   Order-related components
│   └── site/                 #   Public site components
├── dashboard/                # Dashboard page routes
│   ├── kitchen/              #   Kitchen display system
│   ├── menu/                 #   Menu management page
│   ├── operations/           #   Operations page
│   ├── orders/               #   Orders management page
│   ├── sessions/             #   Sessions page
│   ├── settings/             #   Settings page
│   ├── staff/                #   Staff management page
│   ├── tables/               #   Tables management page
│   └── waiter-order/         #   Waiter order-taking page
├── forgot-password/          # Password reset page
├── hooks/                    # Shared React hooks
├── login/                    # Login page
└── qr/                       # Customer-facing QR ordering page
    ├── session-conflict/     #   Conflict resolution component
    └── table/                #   Table-specific ordering page
```

### `src/components/` — Shared UI Primitives

Contains the **shadcn/ui** component library (generated via `components.json`):

```
src/components/ui/
├── button.tsx
├── dialog.tsx
├── select.tsx
├── switch.tsx
├── ... (other shadcn primitives)
```

### `src/lib/` — Shared Library Code

```
src/lib/
├── auth/
│   └── roles.ts              # Role enum (owner, manager, cashier, kitchen, waiter)
├── supabase/
│   ├── admin.ts              # Service-role Supabase client (server-only, bypasses RLS)
│   ├── client.ts             # Browser Supabase client (for client components)
│   └── server.ts             # Server Supabase client (for server components/route handlers)
├── dashboard/                # Dashboard utility functions
├── navigation/               # Navigation helpers
├── orders/                   # Order utility functions
├── billing/                  # Billing helpers
├── restaurant/               # Restaurant-related utilities
├── createNotification.ts     # Notification creation helper
├── notification-types.ts     # Notification type definitions
├── requireRestaurantUser.ts  # Auth guard: validates restaurant membership + active status
├── resolvePublicRestaurant.ts# Public restaurant resolver (for QR pages)
├── restaurantResolver.ts     # Domain-based restaurant resolution from host header
└── utils.ts                  # Generic utilities (cn() class merge, etc.)
```

### `src/modules/` — Domain-Driven Business Logic

Each module follows a consistent pattern (where applicable):

```
module-name/
├── types.ts                  # TypeScript type definitions
├── schemas.ts                # Zod validation schemas
├── services/
│   └── *.service.ts          # Business logic services
├── repositories/
│   └── *.repository.ts       # Data access layer (Supabase queries)
├── validators/               # Validation logic
├── utils/                    # Module-specific utilities
└── components/               # Module-specific React components
```

Modules present:

| Module | Purpose | Verified from Code |
|---|---|---|
| `analytics` | Daily/hourly/item-level analytics for dashboards | Assumed from schema-v2.md |
| `application` | Use cases for session lifecycle (start, place order, complete, request bill, request waiter) | **Verified** — contains 5 use case files |
| `attendance` | Staff clock-in/out services, distance calculation, attendance summary | **Verified** — clockIn.ts, clockOut.ts, getAttendanceSummary.ts, getTodayAttendance.ts exist |
| `auth` | Authentication logic | **Partially verified** — only `repositories/` subdirectory exists, no services |
| `billing` | Payment transaction processing | Assumed from schema-v2.md |
| `core` | Base classes, database schema, restaurants, permissions, events, caching, logging, notifications, realtime, workflows | **Verified** — base.repository.ts, base.service.ts, 2 restaurant services, 2 restaurant repositories, 1 empty events dir, 1 empty logging dir |
| `dashboard` | Dashboard-specific aggregation services | **Verified** — businessInsights.service.ts, dashboard.service.ts, revenueTrend.service.ts |
| `online-ordering` | Online ordering (non-QR) functionality | Assumed from directory name |
| `orders` | Order lifecycle (repository + service with in-memory filtering) | **Verified** — OrderRepository queries `orders` table, OrderService has getRestaurantOrders/getDashboardData/getKitchenDashboardData |
| `qr-ordering` | QR-code-based ordering flow | **Verified** — menuRepository, restaurantRepository, menuService, qrOrderStorage, restaurantResolver, session types |
| `receipt` | Receipt generation and printing (browser + Tauri) | **Verified** — browserPrinter.ts, tauriPrinter.ts, printReceipt.ts, isTauri.ts, getReceiptData.ts |
| `sessions` | Table session lifecycle with 7 service files | **Verified** — SessionRepository, SessionService, SessionLifecycleService, session-cookie/expiry/token/validator services |
| `settings` | Attendance settings CRUD | **Verified** — getAttendanceSettings.ts, updateAttendanceSettings.ts, attendance-settings.schema.ts |
| `shared` | Cross-module shared components, constants, hooks, types, UI, utils, validators | **Partially verified** — subdirectories exist but some (hooks, types) appear empty |
| `staff` | Staff CRUD, role assignment, employment status | **Verified** — StaffRepository, StaffService, schemas.ts, types.ts |
| `tables` | Table management (repository + service + types) | **Verified** — TableRepository, TableService, table.types.ts |
| `waiter` | Waiter-specific operations | **Partially verified** — only type.ts exists |

### `src/store/` — Zustand State Management

```
src/store/
└── qrCartStore.ts            # Zustand store with persist middleware for QR cart
                                (CartItem[], addToCart, removeFromCart, clearCart,
                                 localStorage persistence with migration v2)
```

**[Verified]** Only one Zustand store exists in the project. It handles the QR ordering cart with localStorage persistence (version 2), hydration tracking, and cross-restaurant cart management.

### `src/styles/` and `src/utils/`

- `src/styles/` — Global CSS / Tailwind overrides
- `src/utils/` — General-purpose utility functions

---

## 4. Complete Request Lifecycle

### Example: Customer Places an Order via QR Code

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. Customer scans QR code on table                                 │
│     → Opens https://restaurant.com/qr/table/{tableId}              │
├─────────────────────────────────────────────────────────────────────┤
│  2. Page loads:                                                     │
│     → Server Component fetches restaurant + menu data               │
│       via resolvePublicRestaurant()                                 │
│     → Client Component hydrates with menu items, variants, addons   │
├─────────────────────────────────────────────────────────────────────┤
│  3. Customer adds items to cart:                                    │
│     → useQRCartStore (Zustand + persist to localStorage)            │
├─────────────────────────────────────────────────────────────────────┤
│  4. Customer submits order:                                         │
│     → POST /api/orders  (via qr-ordering API endpoint)             │
│     → Route Handler validates with Zod schema                       │
│     → Calls order service → order repository                        │
│     → Uses supabaseAdmin (service role)                             │
│     → Inserts into order_groups, orders, order_items, addons       │
│     → Returns success + order ID                                    │
├─────────────────────────────────────────────────────────────────────┤
│  5. Kitchen Display System / Waiter Dashboard updates:              │
│     → Real-time subscription via Supabase Realtime (channels)       │
│     → Kitchen screen shows new order                                 │
│     → Waiter app shows notification                                  │
├─────────────────────────────────────────────────────────────────────┤
│  6. Staff prepares order, marks it ready:                           │
│     → PATCH /api/dashboard/orders/status  { id, status: "ready" }  │
├─────────────────────────────────────────────────────────────────────┤
│  7. Customer receives notification (on-screen / sound)              │
├─────────────────────────────────────────────────────────────────────┤
│  8. Billing: Cashier/waiter processes payment:                      │
│     → POST /api/dashboard/orders/payment                           │
│     → Records in payment_transactions table                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Verification status:** The QR ordering page exists at `src/app/qr/table/`. The `src/modules/application/use-cases/` directory has files for `place-order.use-case.ts`, `start-session.use-case.ts`, `complete-session.use-case.ts`, `request-bill.use-case.ts`, and `request-waiter.use-case.ts` — but these files appear to be empty stubs (only `export {};` in one verified case). The actual order flow likely uses the `orders` module's repository and service directly.

### Example: Staff Management (Owner Dashboard)

```
┌───────────────────────────────────────────────────────────────┐
│  1. Owner navigates to /dashboard/staff                      │
│     → Server Component: requireOwnerUser()                   │
│       • Creates Supabase server client from cookies           │
│       • Resolves restaurant from host header                  │
│       • Fetches restaurant_user membership                    │
│       • Checks is_active flag (profile + membership)          │
│       • Checks role === "owner"                               │
├───────────────────────────────────────────────────────────────┤
│  2. StaffPageClient renders with initial params               │
│     → Client Component fetches /api/dashboard/staff           │
│       ?page=1&limit=10&search=&role=all&status=all&sort=newest│
├───────────────────────────────────────────────────────────────┤
│  3. API Route Handler (GET):                                  │
│     → requireOwnerUser() again (server-side check)            │
│     → Calls staffService.getRestaurantStaff()                 │
│       → StaffRepository queries restaurant_users table         │
│       → Applies count: "exact" for pagination                 │
│       → Filters by restaurant_id, role, status                │
│       → Sorts by created_at or role                           │
│       → Applies .range(from, to) for pagination               │
│       → Fetches profiles from users table for search          │
│       → Performs in-memory search filtering                   │
│       → Returns paginated results with total count            │
├───────────────────────────────────────────────────────────────┤
│  4. Owner creates new staff member:                           │
│     → StaffDialog collects full_name, email, phone, role, etc  │
│     → Zod validation (createStaffSchema)                       │
│     → POST /api/dashboard/staff                              │
│     → requireOwnerUser() validates owner role                 │
│     → staffService.createStaff():                             │
│       • Creates Supabase Auth user with admin.createUser       │
│       • Checks for "already been registered" error             │
│       • Inserts into users table                               │
│       • On profile insert failure: deletes auth user           │
│       • Calls get_next_employee_id RPC                        │
│       • Inserts into restaurant_users table                   │
│       • On membership failure: deletes user + auth user        │
│       • Returns success / error (email_exists, phone_exists)  │
└───────────────────────────────────────────────────────────────┘
```

**Verification status:** Every step verified from actual source code in `src/app/dashboard/staff/page.tsx`, `src/app/api/dashboard/staff/route.ts`, `src/modules/staff/services/staff.service.ts`, and `src/modules/staff/repositories/staff.repository.ts`.

---

## 5. Authentication Flow

### Architecture

Authentication is handled entirely by **Supabase SSR** with three client variants:

| Client | File | Scope | Purpose |
|---|---|---|---|
| Browser Client | `src/lib/supabase/client.ts` | Client Components | Public operations, user-triggered auth. Uses `createBrowserClient` from `@supabase/ssr`. |
| Server Client | `src/lib/supabase/server.ts` | Server Components / Route Handlers | Session validation, cookie-based auth. Uses `createServerClient` from `@supabase/ssr` with `cookies()` API. |
| Admin Client | `src/lib/supabase/admin.ts` | Server-only | Service-role access (bypasses RLS). Guarded with `"server-only"` import. Uses `SUPABASE_SERVICE_ROLE_KEY`. Disables autoRefreshToken and persistSession. |

### Flow

```
1. User visits /login
   → Server Component renders login page
   → Client Component handles form submission
   → Calls supabase.auth.signInWithPassword() via browser client

2. On success:
   → Supabase sets session cookies (httpOnly)
   → Next.js middleware runs on next request

3. Middleware (middleware.ts):
   → Creates a Supabase server client from cookies
   → Calls supabase.auth.getUser()
   → If /dashboard/* and no user → redirect to /login
   → If /login and user exists → redirect to /dashboard/orders

4. Protected pages call requireRestaurantUser():
   → Creates server client, resolves restaurant from host
   → Fetches user from Supabase Auth via supabase.auth.getUser()
   → Fetches membership from restaurant_users table
   → Fetches profile from users table
   → Checks is_active on both profile and membership
   → If inactive → signs out user, redirects to /login?error=account_disabled
   → If no valid membership → redirects to /login

5. API route handlers:
   → Call requireOwnerUser() or requireRestaurantUser() at the top
   → These redirect (307) the caller if unauthorized
   → Data operations use supabaseAdmin (service role) to bypass RLS
```

### Cookie Handling

- `middleware.ts` reads/writes cookies from the request/response using `getAll()`/`setAll()` methods
- `src/lib/supabase/server.ts` reads/writes cookies from the `cookies()` API in Server Components / Route Handlers. Wraps `setAll` in try/catch to handle Server Component cookie restrictions.
- Admin client disables cookie persistence (`autoRefreshToken: false, persistSession: false`)

### Cookie Security Analysis

- **Verified:** Supabase SSR uses httpOnly cookies by default for session management
- **Not verified:** No explicit `Secure`, `SameSite`, or `maxAge` cookie configuration found in application code — these are handled by Supabase SDK internally
- **Concern:** Middleware cookie handling is correct for reads but `setAll` in middleware handles both request and response cookies, which is the recommended Supabase SSR pattern

---

## 6. User Roles and Permissions

### Role Enum (defined in `src/lib/auth/roles.ts`)

```typescript
export const ROLES = {
  OWNER:   "owner",
  MANAGER: "manager",
  CASHIER: "cashier",
  KITCHEN: "kitchen",
  WAITER:  "waiter",
} as const
```

### Permission Matrix (inferred from codebase)

| Feature | Owner | Manager | Cashier | Kitchen | Waiter |
|---|---|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ | ✅ (limited) | ✅ (limited) |
| Manage Staff (CRUD) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Menu | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Tables | ✅ | ✅ | ❌ | ❌ | ✅ (assign) |
| View Orders | ✅ | ✅ | ✅ | ✅ | ✅ |
| Process Billing | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Attendance | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kitchen Display | ❌ | ❌ | ❌ | ✅ | ❌ |
| Waiter Order Entry | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage Sessions | ✅ | ✅ | ✅ | ❌ | ✅ |

**Note:** Exact permission enforcement is handled in the API layer (`requireOwnerUser()` restricts owner-only endpoints). Page-level access is enforced via the middleware (authenticated user) + `requireRestaurantUser()` / `requireOwnerUser()` on each dashboard page.

**Verified from code:** Only `requireOwnerUser()` is implemented as a distinct permission check. All other roles are implicitly allowed through `requireRestaurantUser()` which only validates that the user has a valid role from `VALID_ROLES`. There is no granular permission system — the check is binary: "is this user an owner?" vs "is this user a valid staff member?"

---

## 7. Database Tables and Relationships

The database schema is documented in `src/modules/core/database/schema-v2.md` and implemented in Supabase (PostgreSQL). No ORM is used — tables are queried directly via the Supabase JS client.

### Table Groups

#### Core
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `restaurants` | Tenant restaurants | PK for all restaurant-scoped tables | ✅ Via RestaurantRepository |
| `restaurant_users` | Many-to-many: users ↔ restaurants | `restaurant_id → restaurants`, `user_id → users` | ✅ Via StaffRepository |
| `restaurant_modules` | Feature flags per restaurant | `restaurant_id → restaurants` | ✅ Via RestaurantFeatureRepository |

#### Users & Staff
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `users` | User profiles (staff + customers) | `id` linked to `restaurant_users.user_id` | ✅ Via StaffRepository.getProfiles() |
| `restaurant_users` | Staff membership + role + status | See Core section | ✅ Via StaffRepository |

#### Tables & Sessions
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `restaurant_tables` | Physical table entities | `restaurant_id → restaurants` | ✅ Via TableRepository |
| `table_sessions` | Active dining sessions per table | `table_id → restaurant_tables` | ✅ Via SessionRepository |
| `table_events` | Events within a session | `session_id → table_sessions` | Assumed from schema-v2.md |

#### Orders
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `order_groups` | Group of orders (one submission) | `session_id → table_sessions` | Assumed from schema-v2.md |
| `orders` | Individual orders within a group | `group_id → order_groups` | ✅ Via OrderRepository (uses `restaurant_id` filter) |
| `order_items` | Line items within an order | `order_id → orders` | ✅ Via OrderRepository (nested select) |
| `order_item_addons` | Addon selections per item | `order_item_id → order_items` | ✅ Via OrderRepository (nested select) |
| `order_events` | Status changes / events on orders | `order_id → orders` | Assumed from schema-v2.md |

#### Menu
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `menu_categories` | Menu grouping | `restaurant_id → restaurants` | Assumed from schema-v2.md |
| `menu_items` | Individual menu items | `category_id → menu_categories` | Assumed from schema-v2.md |
| `menu_item_variants` | Size/option variants | `item_id → menu_items` | Assumed from schema-v2.md |
| `menu_item_addons` | Optional addons per item | `item_id → menu_items` | Assumed from schema-v2.md |

#### Billing
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `payment_transactions` | Payment records | `session_id → table_sessions` | Assumed from schema-v2.md |

#### Staff Operations
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `attendance_logs` | Clock-in/out records | `user_id → users`, `restaurant_id → restaurants` | Assumed from schema-v2.md, partially from attendance service |

#### Requests
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `requests` | Customer service requests | `session_id → table_sessions` | Assumed from schema-v2.md |

#### Notifications
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `notifications` | Push/in-app notifications | `restaurant_id → restaurants`, `user_id → users` | Assumed from schema-v2.md |

#### Analytics
| Table | Description | Key Relationships | Verified |
|---|---|---|---|
| `analytics_daily` | Daily aggregated metrics | `restaurant_id → restaurants` | Assumed from schema-v2.md |
| `analytics_hourly` | Hourly aggregated metrics | `restaurant_id → restaurants` | Assumed from schema-v2.md |
| `analytics_items` | Per-item sales analytics | `restaurant_id → restaurants` | Assumed from schema-v2.md |

### Database Functions (identified in code)
- `get_next_employee_id(restaurant_uuid)` — Generates sequential employee IDs. Called in `StaffRepository.getNextEmployeeId()`.

### Database Integrity Observations

| Finding | Impact |
|---|---|
| No UNIQUE constraint verified on `users.email` or `users.phone` — the staff service checks for "23505" (PostgreSQL unique violation) code on insert | Medium — relies on catch block, not explicit constraint |
| `restaurant_users` table has no CASCADE DELETE verified — staff deletion does 3 separate delete calls | High — partial deletion risk |
| `orders` table has no CASCADE DELETE on `restaurant_id` foreign key — verified from absence of cascade in repository | Not verified from DB, but assumed |
| No database migration files exist — schema documented only in markdown | Critical — schema drift risk |

---

## 8. API Endpoints Grouped by Module

All endpoints are defined as Next.js Route Handlers in `src/app/api/`.

### Dashboard Endpoints (`/api/dashboard/*`)

| Method | Path | Auth | Module | Verified |
|---|---|---|---|---|
| GET | `/api/dashboard/staff` | Owner | Staff | ✅ route.ts |
| POST | `/api/dashboard/staff` | Owner | Staff | ✅ route.ts |
| PATCH | `/api/dashboard/staff` | Owner | Staff | ✅ route.ts |
| PUT | `/api/dashboard/staff` | Owner | Staff | ✅ route.ts (employment status) |
| DELETE | `/api/dashboard/staff` | Owner | Staff | ✅ route.ts |
| GET/POST/* | `/api/dashboard/menu/*` | Auth | Menu | ✅ directory exists |
| GET/POST/* | `/api/dashboard/orders/*` | Auth | Orders | ✅ directory exists |
| GET/POST/* | `/api/dashboard/orders/payment` | Auth | Orders | ✅ subdirectory verified |
| GET/POST/* | `/api/dashboard/orders/status` | Auth | Orders | ✅ subdirectory verified |
| GET/POST/* | `/api/dashboard/orders/available` | Auth | Orders | ✅ subdirectory verified |
| GET/POST/* | `/api/dashboard/tables/*` | Auth | Tables | ✅ directory exists |
| GET/POST/* | `/api/dashboard/attendance/clock-in` | Auth | Attendance | ✅ subdirectory verified |
| GET/POST/* | `/api/dashboard/attendance/clock-out` | Auth | Attendance | ✅ subdirectory verified |
| GET/POST/* | `/api/dashboard/sessions/*` | Auth | Sessions | ✅ directory exists |
| GET/POST/* | `/api/dashboard/waiter/*` | Auth | Waiter | ✅ directory exists |
| GET/POST/* | `/api/dashboard/notifications/*` | Auth | Notifications | ✅ directory exists |
| GET/POST/* | `/api/dashboard/settings/*` | Auth | Settings | ✅ directory exists |
| GET/POST/* | `/api/dashboard/requests/*` | Auth | Requests | ✅ directory exists |

### Public Endpoints

| Method | Path | Auth | Module | Verified |
|---|---|---|---|---|
| GET | `/api/menu/*` | None | Menu | ✅ directory exists |
| GET | `/api/qr/*` | None | QR | ✅ directory exists |
| GET | `/api/maps/*` | None | Maps | ✅ directory exists |
| * | `/api/dev/*` | None | Dev | ✅ directory exists |

### API Standardization Audit

**Verified issues:**

1. **Inconsistent response format:** The staff endpoint uses `{ success: true, staff: ..., total: ..., page: ..., limit: ..., totalPages: ... }`. Other endpoints may use different formats.
2. **Inconsistent auth:** Staff endpoint uses `requireOwnerUser()`. Other dashboard endpoints likely use `requireRestaurantUser()`. Not all endpoints have been verified.
3. **No shared API response type:** Each route handler defines its own response shape inline with `NextResponse.json()`.
4. **No HTTP method validation:** If an unsupported HTTP method is sent, Next.js returns a default 405 with no custom handling.

---

## 9. Frontend Architecture

### Rendering Strategy

| Type | Used For |
|---|---|
| **React Server Components (RSC)** | Data-fetching pages, auth checks, initial state |
| **Client Components** | Interactive UI (forms, dialogs, real-time updates) |
| **Next.js Route Handlers** | All API endpoints (server-side) |

### Component Hierarchy (Staff Management Example)

```
StaffPage (Server Component)
  └── StaffPageClient (Client Component)
        ├── StaffStats
        ├── StaffTableHeader (search, filters)
        ├── StaffTable (Client)
        │     ├── StaffTableRow (desktop)
        │     │     └── StaffRowMenu (actions dropdown)
        │     └── StaffManagementTable (mobile responsive)
        ├── AddStaffDialog
        │     └── StaffDialog
        │           ├── StaffDialogHeader
        │           ├── StaffBasicSection
        │           ├── StaffCredentialsSection
        │           ├── RoleSelector
        │           ├── StaffEmploymentSection
        │           │     └── EmploymentStatusSelector
        │           ├── StaffShiftSection
        │           └── DialogFooter
        └── EditStaffDialog
              └── StaffDialog (same dialog, edit mode)
                [... same sections ...]
```

### Shared Dashboard Components (`src/app/components/dashboard/`)

```
dashboard/
├── cards/          # Stat display cards
├── charts/         # Recharts-based charts (bar, line, pie)
├── form/           # Form input components
├── header/         # Dashboard header with breadcrumbs
├── mobile/         # Bottom sheet navigation for mobile
├── notification/   # Notification dropdown / list
├── owner/          # Owner-only dashboard components
├── sections/       # Dashboard section wrappers
├── settings/       # Settings page components
├── sidebar/        # Navigation sidebar
├── staff/          # Staff-related dashboard components
└── ui/             # Generic dashboard UI elements
```

### Styling

- **Tailwind CSS v4** with PostCSS (`@tailwindcss/postcss`) — Verified from postcss.config.mjs and tailwind v4 in package.json
- **tw-animate-css** for animation utilities — Verified from package.json
- **class-variance-authority** + **tailwind-merge** for component variants (shadcn style) — Verified from package.json
- React compiler enabled (`reactCompiler: true` in next.config.ts) — **Verified**

### Frontend Observations

- **Server Components are used correctly** for auth gating (StaffPage calls `requireOwnerUser()` before rendering)
- **Client Components handle interactivity** — dialogs, form inputs, search/filter UI
- **No dynamic imports with `next/dynamic` observed** — large libraries (Recharts, Leaflet) are likely bundled unconditionally
- **`src/app/hooks/`** directory exists but contents not fully verified

---

## 10. Backend Architecture

### Architecture Pattern

The backend follows a **Layered Architecture** within a monolithic Next.js application:

```
┌──────────────────────────────────────────────┐
│  Next.js Route Handlers (src/app/api/*)      │  ← HTTP Layer
│  - Parse request/response                     │
│  - Auth guard (requireOwnerUser)              │
│  - Zod validation                             │
├──────────────────────────────────────────────┤
│  Services (src/modules/*/services/*)          │  ← Business Logic Layer
│  - Orchestrate business rules                 │
│  - Call repositories                          │
│  - Handle transactions                        │
├──────────────────────────────────────────────┤
│  Repositories (src/modules/*/repositories/*)  │  ← Data Access Layer
│  - Supabase queries                           │
│  - Supabase RPC calls                         │
│  - No ORM abstraction                         │
├──────────────────────────────────────────────┤
│  Supabase (PostgreSQL)                        │  ← Database Layer
│  - Tables, RLS, RPC functions                 │
│  - Realtime subscriptions                     │
└──────────────────────────────────────────────┘
```

### Key Design Decisions

1. **No ORM** — Database is accessed directly via `supabaseAdmin` (service role client). This means no migration files, no schema generation — the schema is managed separately (documented in `schema-v2.md`). This is a significant architectural choice that trades type safety and migrations for simplicity.
2. **Service Role Client** — Repositories use `supabaseAdmin` (service role key) for all database operations. This bypasses Row-Level Security (RLS). Authorization is handled at the application layer via `requireRestaurantUser()` / `requireOwnerUser()`.
3. **Domain Modules** — Each business domain (staff, orders, tables, etc.) is encapsulated in a `src/modules/` directory with its own types, services, and repositories. This enables independent evolution of each domain.
4. **Base Classes** — `BaseRepository` wraps `supabaseAdmin` with a `protected async db()` method. `BaseService` provides utility methods (`now()`, `generateUUID()`). Not all modules inherit from these — `StaffService` and `StaffRepository` do not use `BaseRepository`/`BaseService`.
5. **Use Case Layer (incomplete)** — `src/modules/application/use-cases/` contains 5 files but they are stubs (empty in 2 verified cases). This pattern was started but not implemented.

### Server-Only Code

- `src/lib/supabase/admin.ts` imports `"server-only"` to prevent accidental client-side inclusion of the service role key. **Verified.**
- Runtime checks verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` exist on module load.

---

## 11. State Management

### Zustand (`src/store/qrCartStore.ts`)

The only Zustand store handles the QR ordering cart:

- **Persistence:** `zustand/middleware/persist` with localStorage key `"qr-cart-storage"` (version 2)
- **State:** `CartItem[]` with addons, variants, quantities
- **Actions:** `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart`, `updateCartItem`, `clearCart`, `clearRestaurantCart`
- **Cross-restaurant support:** `clearRestaurantCart(restaurantId)` — cart items from different restaurants are tracked via `restaurantId`
- **Hydration:** `hasHydrated` flag + `onRehydrateStorage` callback to prevent SSR mismatch
- **Migration:** Version 2 migration resets cart to empty state

### Other State Management Observations

- **No global state management for dashboard data** — each page fetches its own data via API calls
- **No React Context for auth** — auth state is fetched server-side and passed as props
- **No Redux** — Zustand is the only state library
- **Verified:** Only one store file exists in `src/store/`

---

## 12. Business Logic by Module

### Staff Module (`src/modules/staff/`)

**Verified from code.** Files: `types.ts`, `schemas.ts`, `services/staff.service.ts`, `repositories/staff.repository.ts`

- **Types:** `Staff`, `StaffProfile`, `StaffRole` (excludes "owner"), `EmploymentStatus`, `ShiftMode`
- **Validation:** Zod schemas (`createStaffSchema`, `updateStaffSchema`) with regex for Indian phone numbers (`^[6-9]\d{9}$`), time format (`/^([01]\d|2[0-3]):([0-5]\d)$/`), and shift start != shift end refinement
- **Key Operations (verified):**
  - `getRestaurantStaff` — Paginated list with Supabase `count: "exact"`, `.range(from, to)`, filters by role/status, sorts by `created_at` or `role`. **In-memory search filtering on fetched results** (N+1 risk for search scenarios).
  - `getProfiles` — Batch fetch user profiles by IDs from `users` table
  - `getNextEmployeeId` — Calls Supabase RPC `get_next_employee_id`
  - `createStaff` — Creates auth user via `supabaseAdmin.auth.admin.createUser()` → inserts into `users` table → inserts into `restaurant_users` table. **Rollback implemented on failure** (deletes auth user and profile on membership failure).
  - `updateStaff` — Updates `users` table and `restaurant_users` table in two separate calls. **No transaction — partial failure possible.**
  - `deleteStaff` — Deletes `restaurant_users` → deletes `users` → deletes auth user. **No transaction — partial deletion possible.**
  - `updateEmploymentStatus` — Updates `restaurant_users.employment_status` only

### Orders Module (`src/modules/orders/`)

**Verified from code.** Files: `services/order.service.ts`, `repositories/order.repository.ts`

- **OrderRepository extends BaseRepository** — Single method `getRestaurantOrders(restaurantId)` fetches all orders with nested `order_items` and `order_item_addons` via Supabase `select()`. **No pagination — fetches ALL orders.**
- **OrderService** — Exposes `getRestaurantOrders`, `getDashboardData`, `getKitchenDashboardData`. **All filtering done in-memory** (filterOrders, getCounts, getTodayRevenue). **No pagination passed to frontend.**
- **Performance concern:** For restaurants with thousands of orders, fetching all orders and filtering in-memory will degrade significantly.
- **Kitchen Dashboard** — Filters orders by status (pending, preparing, ready) in-memory.

### Tables Module (`src/modules/tables/`)

**Verified from code.** Files: `repositories/table.repository.ts`, `services/table.service.ts`, `types/table.types.ts`

- **TableRepository** — CRUD operations on `restaurant_tables` table. `findByQrToken` correctly scopes to `restaurant_id`. `findById` does NOT scope to restaurant (accepts any table ID).
- **TableService** — Wraps repository with `markOccupied`, `markBillRequested`, `markAvailable`, `touch`.
- **Concern:** `TableRepository.findById()` and `TableService.getById()` do not validate restaurant ownership — any authenticated user can query any table by ID.

### QR Ordering Module (`src/modules/qr-ordering/`)

**Verified from code.** Files: `repositories/menuRepository.ts`, `repositories/restaurantRepository.ts`, `services/menuService.ts`, `lib/qrOrderStorage.ts`, `utils/restaurantResolver.ts`, `types/session.ts`

- **menuRepository** — Fetches menu categories, items, variants, addons for a given restaurant ID
- **restaurantRepository** — Resolves restaurant by slug/domain for public QR page
- **menuService** — Business logic for menu display
- **qrOrderStorage** — Client-side order storage utilities
- **restaurantResolver** — Alternative restaurant resolution for QR flow (public, no auth)
- **Note:** This module duplicates some functionality from `src/modules/core/restaurants/` and `src/modules/orders/`

### Sessions Module (`src/modules/sessions/`)

**Verified from code.** 15+ files including repository, service, lifecycle service, cookie service, expiry service, validator service, token service, plus utilities and error classes.

- **SessionRepository** — Full CRUD on `table_sessions`. `findByToken` does NOT scope to restaurant (any session token can be queried). `findActiveByTableId` is scoped only by table ID and status, not restaurant ID.
- **SessionService** — `getOrCreateActiveSession` handles concurrent session creation with a try/catch fallback that re-reads the session. **Noted in code comments as handling race conditions.**
- **SessionLifecycleService** — State machine: active → bill_requested → completed/expired. Validates expiration timestamps.
- **Error handling:** Custom error classes (`SessionExpiredError`, `SessionNotFoundError`). Session error handler utility.

### Analytics Module (`src/modules/analytics/`)

- **Not verified from code files** — directory structure only. Assumed to use `analytics_daily`, `analytics_hourly`, `analytics_items` tables as documented in schema-v2.md.

### Core Module (`src/modules/core/`)

**Verified from code.**
- **`base.repository.ts`** — 7 lines. Abstract class with `protected async db()` returning `supabaseAdmin`.
- **`base.service.ts`** — 9 lines. Abstract class with `now()` and `generateUUID()` utility methods.
- **`restaurants/services/restaurant.service.ts`** — Resolves restaurant by domain (multi-tenant). Throws `Error("Restaurant not found for domain ...")` for unknown domains.
- **`restaurants/repositories/restaurant.repository.ts`** — Queries `restaurants` table by `domain` or `id`. Uses `RESTAURANT_SELECT` with specific columns.
- **`restaurants/services/restaurant-feature.service.ts`** — Manages feature flags via `restaurant_modules` table.
- **`restaurants/repositories/restaurant-feature.repository.ts`** — Data access for feature flags.
- **`restaurants/types/restaurant.types.ts`** — Type definitions for restaurant entity.
- **`restaurants/utils/restaurant.mapper.ts`** — Domain normalization utilities.
- **`restaurants/validators/restaurant.validator.ts`** — Validation logic.
- **Empty directories:** `events/`, `logging/`, `notifications/`, `realtime/`, `workflows/`, `auth/`, `branding/`, `cache/`, `config/`, `database/` (only has base repository and markdown docs), `errors/`, `permissions/`, `services/` (only has base service).

### Application Module (`src/modules/application/`)

**Verified from code.** Contains use case stubs:
- `index.ts` — Empty export
- `use-cases/index.ts` — `export {};` (empty)
- `use-cases/start-session.use-case.ts` — Not verified (file empty or only export)
- `use-cases/place-order.use-case.ts` — Not verified (file empty or only export)
- `use-cases/complete-session.use-case.ts` — Not verified
- `use-cases/request-bill.use-case.ts` — Not verified
- `use-cases/request-waiter.use-case.ts` — Not verified

**Conclusion:** The use case layer is scaffolded but not implemented. Business logic lives directly in services.

### Attendance Module (`src/modules/attendance/`)

**Verified from code.** Files:
- `types.ts` — Attendance type definitions
- `services/clockIn.ts` — Clock-in service
- `services/clockOut.ts` — Clock-out service
- `services/getAttendanceSummary.ts` — Attendance summary aggregation
- `services/getTodayAttendance.ts` — Today's attendance records
- `utils/calculateDistance.ts` — Geo-location distance calculation (for GPS-based clock-in validation)
- `utils/formatWorkedMinutes.ts` — Worked hours formatting
- `utils/getAttendanceDate.ts` — Date utilities for attendance

### Settings Module (`src/modules/settings/`)

**Verified from code.**
- `schemas/attendance-settings.schema.ts` — Zod schema for attendance configuration
- `services/getAttendanceSettings.ts` — Read attendance settings
- `services/updateAttendanceSettings.ts` — Update attendance settings

### Receipt Module (`src/modules/receipt/`)

**Verified from code.**
- `printer/browserPrinter.ts` — Browser-based receipt printing
- `printer/tauriPrinter.ts` — Tauri native app receipt printing
- `printer/printReceipt.ts` — Print orchestration
- `printer/isTauri.ts` — Tauri environment detection
- `services/getReceiptData.ts` — Receipt data aggregation

### Waiter Module (`src/modules/waiter/`)

**Partially verified.** Only `type.ts` exists. No services or repositories found.

### Online Ordering Module (`src/modules/online-ordering/`)

**Not verified from code** — directory exists but no files were listed in the module scan.

---

## 13. Third-Party Integrations

| Integration | Package | Purpose | Configuration | Verified |
|---|---|---|---|---|
| **Supabase** | `@supabase/ssr` v0.10.3, `@supabase/supabase-js` v2.105.4 | Authentication + Database + Realtime | URL + Anon Key + Service Role Key | ✅ package.json + source code |
| **Cloudinary** | `cloudinary` v2.10.0 | Image upload and optimization | Remote pattern in `next.config.ts` | ✅ package.json + next.config.ts |
| **Leaflet** | `leaflet` v1.9.4, `react-leaflet` v5.0.0 | Interactive maps (restaurant locations) | @types/leaflet for TypeScript | ✅ package.json |
| **Recharts** | `recharts` v3.9.2 | Dashboard charts (bar, line, pie) | Client-side rendering | ✅ package.json |
| **QRCode** | `qrcode.react` v4.2.0 | QR code generation for tables/menus | React component | ✅ package.json |
| **Radix UI** | `@radix-ui/react-dialog/select/slot/switch` | Accessible UI primitives | Component library | ✅ package.json |
| **Base UI** | `@base-ui/react` v1.6.0 | Additional UI primitives | Component library | ✅ package.json |
| **Next Themes** | `next-themes` v0.4.6 | Dark/light mode switching | React context | ✅ package.json |
| **Sonner** | `sonner` v2.0.7 | Toast notifications | React component | ✅ package.json |
| **react-hot-toast** | `react-hot-toast` v2.6.0 | Additional toast notifications | React component | ✅ package.json |
| **Zod** | `zod` v4.4.3 | Schema validation (API inputs) | Runtime validation | ✅ package.json + source code |
| **Lucide** | `lucide-react` v1.16.0 | Icon library | React components | ✅ package.json |
| **Netlify** | `@netlify/plugin-nextjs` v5.15.11 | Serverless deployment | `netlify.toml` | ✅ package.json + netlify.toml |
| **Zustand** | `zustand` v5.0.13 | State management | `src/store/` | ✅ package.json + source code |
| **CVA** | `class-variance-authority` v0.7.1 | Component variant management | shadcn/ui pattern | ✅ package.json |

### Integration Observations

- **Dual toast libraries:** Both `sonner` and `react-hot-toast` are installed. This may be unintentional or transitional.
- **No Stripe/Payment Gateway detected** — `payment_transactions` table exists but no payment gateway SDK (Stripe, Razorpay, etc.) is in the dependencies. Payments may be manual/cash-only at this stage.
- **Tauri printer support** — The receipt module has Tauri-specific code, suggesting a desktop app integration may be planned.

---

## 14. Environment Variables

Inferred from the codebase (`src/lib/supabase/*.ts`, `middleware.ts`, `next.config.ts`):

| Variable | Required | Used In | Purpose | Verified |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | supabase clients (admin.ts, client.ts, server.ts, middleware.ts) | Supabase project URL | ✅ Verified in 4 files |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | supabase browser + server clients | Public anon key (browser-safe) | ✅ Verified in 4 files |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | supabase admin client | Secret service role key (server-only) | ✅ Verified in admin.ts |
| `CLOUDINARY_CLOUD_NAME` | Likely | Cloudinary SDK | Cloudinary cloud name | Assumed — not directly verified in code |
| `CLOUDINARY_API_KEY` | Likely | Cloudinary SDK | Cloudinary API key | Assumed |
| `CLOUDINARY_API_SECRET` | Likely | Cloudinary SDK | Cloudinary API secret | Assumed |

**Note:** No `.env.example` file exists in the repository. Environment variables are expected to be configured manually in the deployment environment and local `.env.local`. **This is a documentation gap.**

---

## 15. Tenant Isolation Audit (Critical)

**Methodology:** Every repository and API route was analyzed for `restaurant_id` enforcement.

| Location | restaurant_id Enforced? | Uses Service Role? | RLS Active? | Risk | Recommendation |
|---|---|---|---|---|---|
| **StaffRepository.getRestaurantStaff** | ✅ Yes — `.eq("restaurant_id", restaurantId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | Low — correctly scoped | Add RLS as defense in depth |
| **StaffRepository.getProfiles** | ❌ No — `.in("id", userIds)` without restaurant_id | ✅ Yes (supabaseAdmin) | No (bypassed) | Medium — user IDs may cross tenants | Scope query to restaurant's user IDs via a subquery |
| **StaffRepository.deleteStaff** | ❌ No — only `.eq("user_id", userId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any staff user can be deleted by any owner who obtains a user ID | Must scope to restaurant_id |
| **StaffRepository.updateStaff** | ❌ No — only `.eq("id", userId)` for users, `.eq("user_id", userId)` for restaurant_users | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any user can be updated by any owner | Add restaurant_id scoping |
| **OrderRepository.getRestaurantOrders** | ✅ Yes — `.eq("restaurant_id", restaurantId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | Low | Adequate |
| **SessionRepository.findByToken** | ❌ No — only `.eq("session_token", token)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any session token reveals session data | Must scope to restaurant_id |
| **SessionRepository.findActiveByTableId** | ❌ No — only `.eq("table_id", tableId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — anyone with a table ID can find active sessions | Must scope to restaurant_id |
| **SessionRepository.create** | ✅ Yes — `restaurant_id` in input | ✅ Yes (supabaseAdmin) | No (bypassed) | Low | Adequate |
| **SessionRepository.findById** | ❌ No — only `.eq("id", sessionId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any session can be queried by ID | Must scope to restaurant_id |
| **TableRepository.findByQrToken** | ✅ Yes — `.eq("restaurant_id", restaurantId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | Low | Adequate |
| **TableRepository.findById** | ❌ No — only `.eq("id", tableId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any table can be queried by ID | Must scope to restaurant_id |
| **TableRepository.updateStatus** | ❌ No — only `.eq("id", tableId)` | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any table status can be changed | Must scope to restaurant_id |
| **RestaurantRepository.findByDomain** | ✅ Implicit — domain is unique | ✅ Yes (supabaseAdmin) | No (bypassed) | Low | Adequate |
| **StaffService.createStaff** | ✅ Yes — `restaurant_id` in insert | ✅ Yes (supabaseAdmin) | No (bypassed) | Low | Adequate |
| **StaffService.deleteStaff** | ❌ No — deletes by userId only | ✅ Yes (supabaseAdmin) | No (bypassed) | **High** — any user can be deleted | Add restaurant_id to delete queries |

### Tenant Isolation Risk Summary

| Risk Level | Count | Details |
|---|---|---|
| **Critical** | 0 | No endpoints found with zero tenant scoping |
| **High** | 7 | SessionRepository (3 methods), TableRepository (2 methods), StaffRepository delete/update |
| **Medium** | 1 | StaffRepository.getProfiles (indirect cross-tenant risk) |
| **Low** | 6 | Properly scoped queries |

**Key finding:** Every repository that receives a `sessionId`, `tableId`, or `userId` without also receiving a `restaurantId` has a potential tenant isolation vulnerability. The application relies entirely on application-layer authorization (`requireRestaurantUser`/`requireOwnerUser`) and has **no RLS as fallback**.

---

## 16. Authentication & Authorization Audit

### Endpoint Auth Requirements

| Endpoint | Required Auth | Required Role | Implementation | Correct? |
|---|---|---|---|---|
| GET /api/dashboard/staff | Authenticated | Owner | `requireOwnerUser()` → checks `role === "owner"` | ✅ Correct |
| POST /api/dashboard/staff | Authenticated | Owner | `requireOwnerUser()` | ✅ Correct |
| PATCH /api/dashboard/staff | Authenticated | Owner | `requireOwnerUser()` | ✅ Correct |
| PUT /api/dashboard/staff | Authenticated | Owner | `requireOwnerUser()` | ✅ Correct |
| DELETE /api/dashboard/staff | Authenticated | Owner | `requireOwnerUser()` | ✅ Correct |
| Private dashboard pages (`/dashboard/*`) | Authenticated | Any valid role | `requireRestaurantUser()` | ✅ Correct |
| Staff page (`/dashboard/staff`) | Authenticated | Owner | `requireOwnerUser()` | ✅ Correct |
| Public endpoints (`/api/menu/*`, `/api/qr/*`) | None | None | No auth guard | ✅ Correct for public data |

### Authorization Inconsistencies

| Issue | Impact |
|---|---|
| `requireOwnerUser()` is only implemented for staff. Other admin endpoints use `requireRestaurantUser()` which allows all roles. | A manager could potentially access owner-level API endpoints (menu CRUD, sessions, settings) if those endpoints don't have role-specific guards. |
| No granular role-based access control (RBAC) system — only binary "owner vs. staff" check | Adding new roles or fine-grained permissions requires rewriting every route handler |
| `requireRestaurantUser()` checks `is_active` on both profile and membership, but does NOT check `employment_status` | A terminated staff member could still access the dashboard if `is_active` is true |

### Middleware Behavior

- **Verified:** Middleware correctly protects `/dashboard/*` paths and redirects authenticated users away from `/login`
- **Verified:** Config matcher covers `["/dashboard/:path*", "/login"]`
- **Not verified:** Token refresh behavior — if a session token expires mid-request, the middleware behavior depends on Supabase SSR's refresh mechanism

---

## 17. Transaction Safety Audit

Every workflow that modifies multiple tables was analyzed for transaction safety.

| Workflow | Tables Modified | Transaction Used? | Rollback Exists? | Partial Failure Possible? | Risk |
|---|---|---|---|---|---|
| **Create Staff** | `auth.users`, `users`, `restaurant_users` | ❌ No transaction | ✅ Manual rollback on each step | ✅ Yes — if auth user is created but `users` insert fails, auth user is deleted. If `restaurant_users` fails, both are deleted. | **Medium** — rollback is implemented but not atomic. A crash between operations leaves orphaned records. |
| **Update Staff** | `users`, `restaurant_users` | ❌ No transaction | ❌ No rollback | ✅ Yes — if `users` update succeeds but `restaurant_users` update fails, data is inconsistent. | **High** — role duplication risk (users.role vs restaurant_users.role) |
| **Delete Staff** | `restaurant_users`, `users`, `auth.users` | ❌ No transaction | ❌ No rollback | ✅ Yes — any deletion step can fail independently | **High** — orphaned records |
| **Mark Bill Requested** | `table_sessions`, `restaurant_tables` | ❌ No transaction | ❌ No rollback | ✅ Yes — session updates but table status fails | **High** — table status and session status can desync |
| **Complete & Free Table** | `table_sessions`, `restaurant_tables` | ❌ No transaction | ❌ No rollback | ✅ Yes — session completes but table not freed | **High** — table stuck in occupied state |
| **Expire Session** | `table_sessions`, `restaurant_tables` | ❌ No transaction | ❌ No rollback | ✅ Yes — session expires but table not freed | **High** — table stuck in occupied state |
| **Create Order** | `order_groups`, `orders`, `order_items`, `order_item_addons` | ❌ No transaction (assumed) | ❌ Not verified | ✅ Yes (assumed) | **High** — partial order insert |
| **Clock In** | `attendance_logs` | Single table | N/A | Low | Single operation |

**Critical Finding:** Supabase JS client does support transactions via RPC (PostgreSQL functions), but the codebase uses individual `insert`/`update`/`delete` calls without wrapping them in transactions. Every multi-table workflow has partial failure risk.

---

## 18. Concurrency & Race Condition Audit

| Scenario | Race Condition | Existing Protection | Risk | Recommendation |
|---|---|---|---|---|
| **Session creation for same table** | Two customers scan the same QR code simultaneously | ✅ `getOrCreateActiveSession` has try/catch with re-read fallback (documented in code comment) | **Low** — handled for the specific case | Consider DB-level unique constraint on `(table_id, status) WHERE status IN ('active','bill_requested')` |
| **Order submission race** | Two orders submitted for same session simultaneously | ❌ No protection | **Medium** — order_items could interleave | Use Supabase RPC for atomic insert |
| **Bill requested + order submission** | Customer requests bill while waiter adds an order | ❌ No status check on order submission | **Medium** — order after bill | Check session status in a transaction before order insert |
| **Clock-in race** | Staff member clocks in from two devices simultaneously | ❌ No protection | **Medium** — duplicate clock-in records | Add unique constraint on `(user_id, date)` for active clock-in |
| **Staff delete while processing** | Owner deletes staff while staff is processing an order | ❌ No protection | **Low** — FK constraint would prevent if cascade not set | Verify before delete |

---

## 19. Idempotency Audit

| Endpoint | Idempotent? | Duplicate Risk | Protection | Recommendation |
|---|---|---|---|---|
| POST /api/dashboard/staff | ❌ No | Creating the same staff twice with different credentials | Zod prevents same email via auth check | Add idempotency key |
| POST /api/dashboard/orders/payment | ❌ No | Processing payment twice for same order | Not verified | Add idempotency key (idempotency-Key header) |
| POST clock-in | ❌ No | Double clock-in | Not verified | Check for existing active clock-in |
| PATCH order status | ✅ Yes (status updates are safe) | Low | N/A | Already safe |
| DELETE staff | ❌ No | Sending delete twice | Second call fails gracefully (user not found) | Low risk |

---

## 20. Repository Audit

| Repository | Responsibility | Public Methods | Query Complexity | Pagination | N+1 Risk | Service Role? | Issues |
|---|---|---|---|---|---|---|---|
| **StaffRepository** | Staff CRUD | 5 | Medium — joins users and restaurant_users | ✅ pagination with `.range()` | ✅ Yes — separate `getProfiles()` call for each search | ✅ Yes | Search filters in-memory; no restaurant_id on delete/update |
| **OrderRepository** | Order queries | 1 | High — nested select with 2 levels | ❌ No pagination — fetches all | Low (single query) | ✅ Yes | No limit — fetches all orders |
| **SessionRepository** | Session lifecycle | 9 | Low | ❌ No pagination | Low | ✅ Yes | No restaurant_id on findByToken, findById, findActiveByTableId |
| **TableRepository** | Table CRUD | 4 | Low | ❌ No pagination | Low | ✅ Yes | No restaurant_id on findById, updateStatus |
| **RestaurantRepository** | Restaurant resolution | 2 | Low | N/A | Low | ✅ Yes | Adequate |
| **MenuRepository** (qr-ordering) | Menu queries | Unknown | Medium | Unknown | Low | Assumed | Not fully verified |

### Key Findings

- **OrderRepository** fetches ALL orders without LIMIT — will break for large restaurants
- **StaffRepository search** does in-memory filtering after fetching matching records — N+1 query pattern for search scenarios
- **SessionRepository** has no pagination on session listing
- **TableRepository** has no pagination on table listing

---

## 21. API Standardization Audit

### Verified Staff Endpoint Contract

**GET /api/dashboard/staff**
- Request: `?page=1&limit=10&search=&role=all&status=all&sort=newest`
- Success Response (200): `{ success: true, staff: [...], total: number, page: number, limit: number, totalPages: number }`
- Error Response (500): `{ success: false, error: "Failed to load staff." }`
- Validation: Query params parsed with `Number()` (no Zod validation on query params)

**POST /api/dashboard/staff**
- Request: `{ full_name, email, phone?, password, role, employment_status?, joined_at?, shift_mode?, attendance_shift_start, attendance_shift_end }`
- Success Response (200): `{ success: true, message: "Staff created successfully." }`
- Error Response (400): `{ error: "Invalid staff details.", issues: {...} }`
- Error Response (409): `{ success: false, field: "email", error: "Email is already registered." }`
- Error Response (500): `{ success: false, error: "Failed to create staff." }`
- Validation: Zod `createStaffSchema`

**PATCH /api/dashboard/staff**
- Request: `{ userId, full_name, phone?, role, employment_status?, shift_mode?, joined_at?, attendance_shift_start, attendance_shift_end }`
- Success Response (200): `{ success: true, message: "Staff updated successfully." }`
- Validation: Zod `updateStaffSchema`

**DELETE /api/dashboard/staff**
- Request: `{ userId }`
- Success Response (200): `{ success: true, message: "Staff deleted successfully." }`

**PUT /api/dashboard/staff** (employment status)
- Request: `{ userId, employment_status: "active" | "on_leave" | "terminated" }`
- Success Response (200): `{ success: true, message: "..." }`

### Inconsistencies Found

1. **Response envelope varies** — Some endpoints return `{ success: true, ... }`, others `{ error: "..." }` without `success` field
2. **Error status codes** — 400 for validation, 409 for conflicts, 500 for server errors. No 401/403 for auth errors (redirect instead)
3. **No shared types** — No `ApiResponse<T>` TypeScript type shared between frontend and backend
4. **Query param validation** — `page` and `limit` are parsed with `Number()` which returns `NaN` for invalid input, with no fallback
5. **No rate limiting headers** — No `Retry-After`, `X-RateLimit-*` headers

---

## 22. Error Handling Audit

| File | Error Pattern | Structured Logging? | Observations |
|---|---|---|---|
| `src/app/api/dashboard/staff/route.ts` | try/catch with `console.error("PREFIX:", error)` | ❌ No — uses `console.error` | String-prefixed console logging |
| `src/modules/staff/services/staff.service.ts` | try/catch with `throw new Error("email_exists")` | ❌ No — uses `console.log` for parsing error | Error messages used as control flow |
| `src/modules/staff/repositories/staff.repository.ts` | `if (error) throw error` | ❌ No | Errors propagate up |
| `src/modules/sessions/errors/` | Custom error classes | ❌ No | Has error infrastructure but no structured logging |
| `src/modules/orders/repositories/order.repository.ts` | `if (error) throw error` | ❌ No | Standard pattern |
| `src/modules/orders/services/order.service.ts` | No try/catch (errors propagate) | ❌ No | Relies on caller |

### Key Issues

1. **No structured logging library** — `console.error()` and `console.log()` are used everywhere
2. **`src/modules/core/logging/` is empty** — logging infrastructure was planned but not implemented
3. **Error messages as control flow** — `throw new Error("email_exists")` is caught by string comparison in the route handler
4. **Sensitive information logged** — `console.log(parsed.error.flatten())` logs Zod validation details which may contain sensitive input
5. **No centralized error handler** — Each route handler has its own try/catch with manual error response construction

---

## 23. Security Audit (Expanded)

| Issue | Severity | Description | Mitigation |
|---|---|---|---|
| **No RLS** | **High** | All repositories use `supabaseAdmin` (service role) which bypasses Row-Level Security. Application-layer authorization is the only protection. | Implement RLS policies on all tables with tenant-scoped `restaurant_id` checks. |
| **Tenant isolation gaps** | **High** | 7 repository methods don't scope queries by `restaurant_id` (see Section 15). | Add `restaurant_id` to all queries. |
| **Host header injection** | **Medium** | `restaurantResolver.ts` uses `x-forwarded-host` or `host` header directly to resolve tenant. An attacker sending a forged `Host` header could be served a different tenant's data. | Validate the host against a whitelist or use URL-safe slugs instead. |
| **No CSRF protection** | **Medium** | API routes accept requests from any origin. Next.js Route Handlers do not have built-in CSRF protection. | Add CSRF tokens or check Origin/Referer headers for state-changing requests. |
| **No rate limiting** | **Medium** | API routes have no rate limiting — vulnerable to brute force on login and DoS on order endpoints. | Add rate limiting with Upstash or a simple in-memory token bucket. |
| **No audit logging** | **Medium** | Staff creation, deletion, role changes, and other sensitive operations are not logged. | Add audit table and log all sensitive operations. |
| **Error information leakage** | **Low** | `console.log(parsed.error.flatten())` logs Zod validation errors that may contain PII. | Remove console.log or redact sensitive fields. |
| **XSS** | **Low** | React 19 + Next.js 16 provide automatic XSS protection for rendered content. API responses with user-generated content could potentially be XSS vectors if consumed by other systems. | React's auto-escaping protects the frontend. Validate and sanitize user input server-side. |
| **SQL Injection** | **Low** | Supabase JS client parameterizes all queries. Raw SQL is not constructed in application code. | Adequate. |
| **SSRF** | **Low** | Cloudinary integration fetches images from remote URLs. Next.js image optimization could be exploited if remotePatterns is not restrictive. | Current remotePatterns only allows "res.cloudinary.com". Adequate. |
| **Open Redirect** | **Low** | Middleware redirects to `/login` and `/dashboard/orders` with hardcoded paths. No user-controlled redirect URLs found. | Adequate. |
| **Cookie Security** | **Low** | Supabase SSR manages cookies internally. No explicit Secure/HttpOnly/SameSite configuration in application code. | Supabase defaults are adequate. Verify in production. |
| **Session Fixation** | **Low** | Supabase handles session tokens securely. | Adequate. |
| **Privilege Escalation** | **Medium** | No granular RBAC — any staff role (manager, cashier, etc.) who accesses endpoints intended for owners could potentially escalate privileges. | Add role checks to all sensitive API endpoints. |

---

## 24. Performance Audit (Expanded)

| Issue | Severity | Description | Recommendation |
|---|---|---|---|
| **No pagination on orders** | **High** | `OrderRepository.getRestaurantOrders()` fetches ALL orders without LIMIT. Query will degrade as order count grows. | Add `.range(from, to)` with `count: "exact"`. |
| **In-memory search filtering** | **High** | Staff search fetches all matching records then filters in memory. Order filtering is entirely in-memory. | Move search to database layer using `ILIKE` or full-text search. |
| **N+1 queries for staff search** | **Medium** | `getProfiles()` is called separately for search, adding an extra query for every search request. | Join `users` table in the main staff query. |
| **No caching** | **Medium** | No Redis, no `react.cache()`, no `unstable_cache`. Every API call hits Supabase. | Cache menu items, restaurant settings, and staff profiles. |
| **Large client bundles** | **Medium** | Recharts, Leaflet, and Radix UI are likely bundled unconditionally. No `next/dynamic` imports observed. | Use `next/dynamic` with `ssr: false` for heavy components. |
| **No image optimization** | **Low** | Cloudinary is configured but no responsive images, lazy loading, or blur placeholders. | Implement next/image with Cloudinary transforms. |
| **Supabase Realtime** | **Medium** | If all dashboard pages subscribe to realtime channels, this can cause excessive connections. | Limit subscriptions to active pages only. Disconnect on unmount. |
| **No database indexing** | **High** | No verified indexes on foreign key columns. Queries on `restaurant_users.restaurant_id`, `orders.restaurant_id`, `table_sessions.table_id` may be table scans. | Add indexes on all foreign keys and frequently queried columns. |

---

## 25. Production Readiness Checklist

| Category | Item | Status | Notes |
|---|---|---|---|
| **Authentication** | Login flow | ✅ Complete | Supabase SSR, middleware, server client |
| | Password reset | 🟡 Partial | `/forgot-password` page exists |
| | Session refresh | 🟡 Partial | Supabase handles automatically |
| | MFA/2FA | ❌ Missing | Not implemented |
| **Authorization** | Role-based access | 🟡 Partial | Only owner vs. staff binary check |
| | Page-level auth | ✅ Complete | middleware.ts + Server Components |
| | API-level auth | 🟡 Partial | Staff endpoints verified, others assumed |
| | Tenant isolation | ❌ Missing | 7 high-risk gaps (see Section 15) |
| **Transactions** | Multi-table atomicity | ❌ Missing | No DB transactions used |
| | Rollback on failure | 🟡 Partial | Only implemented in createStaff |
| **Monitoring** | Structured logging | ❌ Missing | console.error() only |
| | Error tracking | ❌ Missing | No Sentry/DataDog |
| | Performance monitoring | ❌ Missing | No tools configured |
| | Health checks | ❌ Missing | No /api/health endpoint |
| **Rate Limiting** | API rate limiting | ❌ Missing | No protection |
| | Brute force protection | ❌ Missing | Login endpoint |
| **Caching** | Server-side caching | ❌ Missing | No Redis or Next.js cache |
| | Client-side caching | 🟡 Partial | Zustand persist for cart only |
| **Testing** | Unit tests | ❌ Missing | No test files/framework |
| | Integration tests | ❌ Missing | Not implemented |
| | E2E tests | ❌ Missing | Not implemented |
| | Load tests | ❌ Missing | Not implemented |
| **CI/CD** | CI pipeline | ❌ Missing | No GitHub Actions |
| | CD pipeline | 🟡 Partial | Netlify auto-deploy from git |
| | Preview deploys | ❌ Missing | Not configured |
| **Database** | Migration system | ❌ Missing | No migration files |
| | Backup strategy | ❌ Missing | Not documented |
| | Disaster recovery | ❌ Missing | Not documented |
| | Indexes on FK columns | ❌ Missing | Not verified |
| **Deployment** | Environment variables | 🟡 Partial | Documented but no .env.example |
| | Secrets management | 🟡 Partial | Netlify environment variables |
| | CDN configuration | ❌ Missing | Not configured |
| | Domain/DNS | 🟡 Partial | Multi-tenant domain resolution |
| **Observability** | Health checks | ❌ Missing | Not implemented |
| | Metrics | ❌ Missing | Not implemented |
| | Alerts | ❌ Missing | Not implemented |
| **Security** | Security headers | ❌ Missing | Not configured in next.config.ts |
| | CORS configuration | ❌ Missing | Not configured |
| | CSP policy | ❌ Missing | Not configured |
| | Rate limiting | ❌ Missing | Not implemented |
| **Documentation** | API docs | ❌ Missing | No OpenAPI/Swagger |
| | Setup guide | ❌ Missing | README is default Next.js template |
| | Architecture docs | 🟡 Partial | This document |

---

## 26. Missing Features Before Production

### Critical
1. Database migrations system (manual schema changes → drift risk)
2. Tenant isolation fixes (7 high-risk queries)
3. Database transactions for multi-table workflows
4. Pagination on orders endpoint
5. Rate limiting on auth and API endpoints

### High
6. Structured logging (replace console.error)
7. Error tracking service (Sentry)
8. Database indexes on foreign keys
9. API response standardization
10. Granular RBAC beyond owner/staff
11. Audit logging for sensitive operations
12. Order search moved to database layer
13. Health check endpoint

### Medium
14. Caching layer for menu/restaurant data
15. Dynamic imports for heavy libraries
16. .env.example file
17. CSRF protection
18. CI pipeline
19. Unit/integration test suite
20. Security headers (CSP, CORS)
21. Image optimization with next/image

### Future
22. MFA/2FA authentication
23. Webhook system for third-party integrations
24. Multi-region database deployment
25. Message queue for order processing
26. Mobile applications (Tauri desktop app scaffolded)

---

## 27. Testing Strategy

### Current State
- **No test files** found in the codebase
- **No testing framework** in devDependencies (no Jest, Vitest, Playwright, Cypress)
- **No test script** in package.json (only dev, build, start, lint, typecheck)
- **No `__tests__` directories** anywhere in the project

### Recommended Testing Strategy

| Test Type | Tools | Priority | Focus Areas |
|---|---|---|---|
| **Unit Tests** | Vitest | High | Services, repositories, validators, utility functions |
| **Integration Tests** | Vitest + Supertest | High | API route handlers, auth flow, multi-table workflows |
| **Component Tests** | React Testing Library | Medium | Staff dialog, order management UI, dashboard components |
| **E2E Tests** | Playwright | Medium | Full QR ordering flow, staff management, login flow |
| **Load Tests** | k6 or Artillery | Low | Order submission under concurrent load |
| **Security Tests** | OWASP ZAP | Medium | Tenant isolation, auth bypass, injection |

---

## 28. Deployment Architecture

### Current Architecture

```
┌──────────────────────────────────────────────────────┐
│                      Netlify                          │
│  ┌────────────────────────────────────────────────┐   │
│  │           Next.js Application                   │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │  Frontend    │  │  API Route Handlers     │  │   │
│  │  │  (RSC +      │  │  (Backend)              │  │   │
│  │  │   Client)    │  │                         │  │   │
│  │  └─────────────┘  └─────────────────────────┘  │   │
│  └────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│              ┌─────────────────┐                        │
│              │   Supabase      │                        │
│              │  (PostgreSQL +  │                        │
│              │   Auth +        │                        │
│              │   Realtime)     │                        │
│              └─────────────────┘                        │
│                         │                               │
│                         ▼                               │
│              ┌─────────────────┐                        │
│              │   Cloudinary    │                        │
│              │   (Images)      │                        │
│              └─────────────────┘                        │
└──────────────────────────────────────────────────────┘
```

### Infrastructure Details

- **Hosting:** Netlify (serverless functions for API routes, edge functions for middleware)
- **Database:** Supabase managed PostgreSQL
- **Auth:** Supabase Auth (built-in, no custom auth server)
- **Realtime:** Supabase Realtime (WebSocket-based)
- **Images:** Cloudinary (external CDN)
- **Maps:** OpenStreetMap via Leaflet (no API key needed)
- **Domains:** Multi-tenant via host header resolution

### Future Scaling Architecture

```
┌─────────────────────────────────────────────┐
│              Cloudflare CDN                  │
├─────────────────────────────────────────────┤
│         Netlify (Edge + Functions)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Frontend │  │  API     │  │  Admin   │  │
│  │ (Static) │  │ (Server) │  │ (Server) │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│         Supabase (Multi-region)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  DB US   │  │  DB EU   │  │  DB ASIA │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│         Redis Cache (Upstash)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Session  │  │  Menu    │  │  Rate    │  │
│  │  Cache   │  │  Cache   │  │  Limiter │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

---

## 29. Engineering Standards

### Current State

| Practice | Status | Notes |
|---|---|---|
| **Folder structure** | ✅ Consistent | Domain modules follow clear pattern |
| **Naming conventions** | 🟡 Inconsistent | Some files use kebab-case, others camelCase |
| **Repository pattern** | ✅ Used in 5 modules | Staff, Orders, Sessions, Tables, Core |
| **Service pattern** | ✅ Used in 5 modules | Staff, Orders, Sessions, Tables, Core |
| **Zod validation** | ✅ Used in Staff API | Not verified for all endpoints |
| **Auth guards** | 🟡 Inconsistent | `requireOwnerUser` vs `requireRestaurantUser` |
| **Error handling** | ❌ Inconsistent | try/catch per handler, no centralized approach |
| **Logging** | ❌ Missing | console.error() only |
| **TypeScript strict mode** | ✅ Enabled | tsconfig.json |
| **React compiler** | ✅ Enabled | next.config.ts |
| **ESLint** | ✅ Configured | eslint.config.mjs |

### Recommended Standards

1. **API Standard:** All responses use `{ success: boolean, data?: T, error?: string, meta?: { page, limit, total } }`
2. **Repository Methods:** Always include `restaurantId` parameter for tenant scoping
3. **Service Methods:** Validate authorization before business logic
4. **Error Handling:** Use custom error classes with error codes, not string messages
5. **Logging:** Use structured logger with request IDs
6. **Testing:** Minimum 80% coverage on services and repositories
7. **Code Review:** Require auth and tenant isolation checks in every PR

---

## 30. Technical Debt (Expanded)

| ID | Issue | Impact | Affected Files | Priority | Risk | Effort | Dependencies | Recommended Fix |
|---|---|---|---|---|---|---|---|---|
| TD-01 | No database migrations | Schema drift, manual changes | All tables | **Critical** | High | 40h | Supabase CLI | Add Supabase migrations / Drizzle Kit |
| TD-02 | Tenant isolation gaps (7 queries) | Data leak between tenants | session.repository.ts, table.repository.ts, staff.repository.ts | **Critical** | High | 8h | None | Add restaurant_id to all queries |
| TD-03 | No database transactions | Partial updates on failures | staff.service.ts, session.service.ts, table.service.ts | **Critical** | High | 16h | Supabase RPC | Wrap multi-table ops in Supabase RPC/transactions |
| TD-04 | No pagination on orders | Performance degradation | order.repository.ts | **High** | Medium | 4h | None | Add .range() and count |
| TD-05 | In-memory order filtering | Performance, no search | order.service.ts | **High** | Medium | 8h | Database indexes | Move to DB-level WHERE clauses |
| TD-06 | No rate limiting | Brute force, DoS | All API routes | **High** | Medium | 8h | Redis/Upstash | Add rate limiter middleware |
| TD-07 | No structured logging | Poor debugging | All files | **High** | Low | 16h | Pino/Winston | Replace console with structured logger |
| TD-08 | No audit logging | No trail for sensitive ops | staff.service.ts | **High** | Medium | 8h | Audit table | Add audit log table + service |
| TD-09 | No API response standard | Inconsistent client handling | All route handlers | **Medium** | Low | 8h | None | Create shared ApiResponse type |
| TD-10 | Granular RBAC missing | Manager can access owner endpoints | All API routes | **Medium** | Medium | 24h | None | Add role-based middleware |
| TD-11 | Use cases are empty stubs | Dead code area | application/use-cases/ | **Medium** | Low | 1h | None | Remove or implement |
| TD-12 | Empty directories | Dead code (core/events, logging, etc.) | core/events/, core/logging/, core/notifications/ | **Medium** | Low | 1h | None | Remove or document |
| TD-13 | No .env.example | Poor DX for new developers | Root | **Medium** | Low | 1h | None | Create .env.example |
| TD-14 | No health check endpoint | No deployment health validation | API routes | **Medium** | Low | 2h | None | Add GET /api/health |
| TD-15 | Error messages as control flow | Fragile, unmaintainable | staff.service.ts | **Low** | Low | 4h | None | Add error code enum |
| TD-16 | Host header for tenant resolution | Spoofing risk | restaurantResolver.ts | **Medium** | Medium | 8h | CNAME config | Use URL-safe slug, not host header |
| TD-17 | Dual toast libraries | Bundle bloat | package.json | **Low** | Low | 1h | None | Remove react-hot-toast |
| TD-18 | No CI pipeline | No automated checks | Root | **Medium** | Low | 8h | GitHub Actions | Add test/lint/typecheck CI |
| TD-19 | No test suite | No regression protection | All files | **High** | High | 80h | Vitest | Add comprehensive tests |
| TD-20 | Duplicate role in users table | Inconsistency risk | users table, restaurant_users table | **Medium** | Medium | 4h | Schema migration | Remove role from users or sync |

---

## 31. Production Readiness Score

| Category | Score (0-10) | Weight | Weighted Score |
|---|---|---|---|
| **Architecture** | 7/10 | 15% | 1.05 |
| **Security** | 4/10 | 20% | 0.80 |
| **Performance** | 5/10 | 15% | 0.75 |
| **Maintainability** | 5/10 | 15% | 0.75 |
| **Scalability** | 4/10 | 10% | 0.40 |
| **Developer Experience** | 4/10 | 10% | 0.40 |
| **Testing** | 1/10 | 15% | 0.15 |
| **Total** | | **100%** | **4.30/10** |

### Score Rationale

- **Architecture (7/10):** Domain-driven modules are well-structured. The service/repository pattern is clean. However, the use case layer is empty and the module inconsistency (qr-ordering has its own mini-architecture) lowers the score.
- **Security (4/10):** Tenant isolation has critical gaps, no RLS, no rate limiting, no audit logging. Authentication is well-implemented (cookie-based, SSR middleware, active status checks), which keeps this from being lower.
- **Performance (5/10):** React Server Components and React compiler are good. But no pagination on orders, in-memory filtering, no caching, and no image optimization lower the score.
- **Maintainability (5/10):** Consistent folder structure but inconsistent error handling, no logging, no tests, and empty directories.
- **Scalability (4/10):** No message queue, no caching, no database indexes verified, no pagination on orders. Domain resolution via host header limits multi-region scaling.
- **Developer Experience (4/10):** No .env.example, no setup guide (README is Next.js default), no test scripts, no CI pipeline.
- **Testing (1/10):** No test files, no testing framework, no test scripts.

### Estimated Engineering Hours Before Production Launch

| Phase | Hours | Team Size | Calendar Weeks |
|---|---|---|---|
| **Launch Blockers** (Critical) | 64h | 2 devs | 1 week |
| **Security** | 80h | 2 devs | 1 week |
| **Reliability** | 40h | 2 devs | 0.5 week |
| **Performance** | 48h | 2 devs | 0.5 week |
| **Refactoring** | 56h | 2 devs | 0.5 week |
| **Testing** | 120h | 2 devs | 1.5 weeks |
| **Deployment** | 40h | 1 dev | 1 week |
| **Total** | **448h** | **2 devs** | **~6 weeks** |

---

## 32. Engineering Diagrams

### Authentication Flow Diagram

```
┌──────────┐     ┌────────────────┐     ┌──────────────────┐     ┌────────────────┐
│  Browser │────→│  /login Page   │────→│  Supabase Auth   │────→│  Supabase DB   │
│          │     │  (Client)      │     │  (signInWithPwd) │     │  (verify creds)│
└──────────┘     └────────────────┘     └──────────────────┘     └────────────────┘
                      │                        │                         │
                      │                        ▼                         │
                      │              ┌──────────────────┐               │
                      │              │  Set Session     │               │
                      │              │  Cookies         │               │
                      │              └──────────────────┘               │
                      ▼                                                 │
              ┌────────────────┐                                        │
              │  Next Request  │                                        │
              │  (with cookies)│                                        │
              └───────┬────────┘                                        │
                      │                                                 │
                      ▼                                                 │
              ┌────────────────┐                                        │
              │  Middleware    │─────────────────────────────────────────│
              │  (auth check)  │  Reads cookies, calls getUser()        │
              └───────┬────────┘                                        │
                      │                                                 │
          ┌───────────┴────────────┐                                    │
          ▼                        ▼                                    │
  ┌──────────────┐         ┌──────────────┐                             │
  │ /dashboard/* │         │  /login      │                             │
  │ Proc. Page   │         │  Redirect to │                             │
  │              │         │  /dashboard  │                             │
  └──────┬───────┘         └──────────────┘                             │
         │                                                              │
         ▼                                                              │
  ┌────────────────┐                                                    │
  │ requireRestau- │────────────────────────────────────────────────────│
  │ rantUser()     │  Fetches user + membership + profile               │
  └──────┬─────────┘                                                    │
         │                                                              │
    ┌────┴────┐                                                        │
    ▼         ▼                                                         │
  ┌──────┐ ┌────────┐                                                   │
  │Valid │ │Invalid │→ Redirect /login                                  │
  │User  │ │or Inact│                                                   │
  └──────┘ └────────┘                                                   │
```

### Module Dependency Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        src/lib/                               │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────────────┐ │
│  │ supabase │  │  auth/   │  │ requireRestaurantUser.ts    │ │
│  │ clients  │  │  roles   │  │ restaurantResolver.ts       │ │
│  └──────────┘  └──────────┘  └─────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    src/modules/core/                           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ BaseRepository │  │  BaseService   │  │ Restaurants    │ │
│  │ (supabaseAdmin) │  │  (uuid, date) │  │ (service + repo)│ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┬──────────────────┐
         ▼             ▼             ▼                  ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐
  │  staff   │  │  orders  │  │ sessions │  │   tables         │
  │ module   │  │  module  │  │  module  │  │   module         │
  │ (service │  │ (service │  │ (service │  │ (service + repo) │
  │ + repo)  │  │ + repo)  │  │ + repo)  │  │                  │
  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘
       │              │              │               │
       ▼              ▼              ▼               ▼
  ┌──────────────────────────────────────────────────────┐
  │              Supabase Database                        │
  │  restaurants │ users │ restaurant_users │ orders      │
  │  tables      │ sessions │ menu_items │ ...           │
  └──────────────────────────────────────────────────────┘
```

### Database Relationship Diagram

```
restaurants
  ├── restaurant_modules (feature flags)
  ├── restaurant_users ←── users (profiles)
  ├── attendance_logs
  ├── notifications
  ├── menu_categories
  │     └── menu_items
  │           ├── menu_item_variants
  │           └── menu_item_addons
  ├── restaurant_tables
  │     └── table_sessions
  │           ├── order_groups
  │           │     └── orders
  │           │           ├── order_items ←── order_item_addons
  │           │           └── order_events
  │           ├── payment_transactions
  │           └── requests
  ├── analytics_daily
  ├── analytics_hourly
  └── analytics_items
```

---

*Document generated from codebase analysis. Version 2.0 — expanded with production readiness audit. Last updated: July 2026.*

**Legend:**
- ✅ Verified from source code
- 🟡 Partially verified / assumptions remain
- ❌ Missing / not implemented
- **Bold text** in audit tables indicates high-severity findings