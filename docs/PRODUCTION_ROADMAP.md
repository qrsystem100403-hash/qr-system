# QR Ordering Engine — Production Roadmap

> **Document Version:** 1.0  
> **Target:** Production Launch  
> **Estimated Total Effort:** 448 engineering hours (~6 weeks with 2 developers)  
> **Audit Date:** July 2026  

---

## Overview

This document provides a detailed implementation roadmap for taking the QR Ordering Engine from its current state to production readiness. Every issue identified in the architecture audit is broken down into actionable tasks with severity, dependencies, estimated effort, and acceptance criteria.

Tasks are grouped into implementation phases that must be completed in order. Each phase builds on the previous one.

---

## Phase 1: Launch Blockers (Critical — 64 hours)

These issues must be resolved before any production deployment. They represent data integrity, security, and fundamental reliability risks.

### PB-01: Fix Tenant Isolation Gaps

**Severity:** Critical  
**Estimated Hours:** 8h  
**Files Affected:** 
- `src/modules/sessions/repositories/session.repository.ts`
- `src/modules/tables/repositories/table.repository.ts`
- `src/modules/staff/repositories/staff.repository.ts`

**Description:** Seven repository methods do not scope queries by `restaurant_id`, allowing potential cross-tenant data access. Every query that receives a `sessionId`, `tableId`, or `userId` without a `restaurantId` must be fixed.

**Database Changes:** None (all columns already exist)

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `SessionRepository.findByToken()` adds `.eq("restaurant_id", restaurantId)` parameter
- [ ] `SessionRepository.findActiveByTableId()` accepts `restaurantId` and scopes query
- [ ] `SessionRepository.findById()` accepts `restaurantId` and scopes query
- [ ] `TableRepository.findById()` accepts `restaurantId` and scopes query
- [ ] `TableRepository.updateStatus()` accepts `restaurantId` and scopes query
- [ ] `StaffRepository.getProfiles()` scopes to restaurant's user IDs via subquery
- [ ] `StaffRepository.deleteStaff()` scopes by both `userId` and `restaurantId`
- [ ] `StaffRepository.updateStaff()` accepts and scopes by `restaurantId`
- [ ] All callers pass `restaurantId` to these methods

**Testing Requirements:**
- Write integration test that creates two tenants with overlapping IDs and verifies no cross-tenant access
- Write unit tests for each fixed repository method

---

### PB-02: Implement Database Migrations

**Severity:** Critical  
**Estimated Hours:** 40h  
**Files Affected:** Project root (new `supabase/migrations/` directory)

**Description:** The database schema is currently documented only in `src/modules/core/database/schema-v2.md`. There are no migration files. Every schema change requires manual SQL execution against the Supabase project. Implement a migration system using Supabase CLI migrations (or Drizzle Kit for type-safe migrations).

**Database Changes:** None (tooling only)

**Dependencies:** Supabase CLI or Drizzle Kit installation

**Acceptance Criteria:**
- [ ] Supabase CLI migrations initialized (or Drizzle Kit configured)
- [ ] Initial migration captures current schema from `schema-v2.md`
- [ ] Migration files are versioned and timestamped
- [ ] `package.json` has migration scripts: `db:migrate`, `db:rollback`, `db:status`
- [ ] CI runs migrations in preview environments
- [ ] Migration README documents the workflow

**Testing Requirements:**
- Run migration against a fresh Supabase project
- Verify all tables, relationships, and RPC functions are created

---

### PB-03: Add Database Transactions to Multi-Table Workflows

**Severity:** Critical  
**Estimated Hours:** 16h  
**Files Affected:**
- `src/modules/staff/services/staff.service.ts`
- `src/modules/sessions/services/session.service.ts`

**Description:** Every workflow that modifies multiple tables must be wrapped in a database transaction to prevent partial updates. The Supabase JS client supports transactions via PostgreSQL functions (RPC). Create Supabase RPC functions for: createStaff, updateStaff, deleteStaff, markBillRequested, completeAndFreeTable, expireSession.

**Database Changes:** Create 6 Supabase RPC functions

**Dependencies:** PB-02 (migration system)

**Acceptance Criteria:**
- [ ] `create_staff` RPC function wraps auth user creation + users insert + restaurant_users insert
- [ ] `update_staff` RPC function wraps users update + restaurant_users update
- [ ] `delete_staff` RPC function wraps restaurant_users delete + users delete + auth user delete
- [ ] `mark_bill_requested` RPC function wraps session update + table status update
- [ ] `complete_and_free_table` RPC function wraps session complete + table available
- [ ] `expire_session` RPC function wraps session expire + table available
- [ ] All RPC functions use PostgreSQL `BEGIN`/`COMMIT`/`ROLLBACK`
- [ ] Service layer calls RPC functions instead of individual Supabase calls
- [ ] Error handling in service layer provides clear error messages

**Testing Requirements:**
- Test each RPC function with a forced failure mid-transaction (e.g., invalid FK)
- Verify no partial updates remain when a transaction fails

---

### PB-04: Add Pagination to Orders Endpoint

**Severity:** Critical  
**Estimated Hours:** 4h  
**Files Affected:**
- `src/modules/orders/repositories/order.repository.ts`
- `src/modules/orders/services/order.service.ts`

**Description:** `OrderRepository.getRestaurantOrders()` fetches ALL orders without LIMIT or OFFSET. This will cause severe performance degradation as order count grows. Add pagination with `.range(from, to)` and `count: "exact"`.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `getRestaurantOrders()` accepts `page` and `limit` parameters
- [ ] Query uses `.range((page-1) * limit, page * limit - 1)`
- [ ] Query uses `.select("*", { count: "exact" })` for total count
- [ ] Return type includes `{ data, total, page, limit, totalPages }`
- [ ] All callers updated to pass pagination params
- [ ] Frontend handles pagination UI (page controls, page size selector)

**Testing Requirements:**
- Unit test with 100+ mock orders, verify correct page splitting
- Verify `totalPages` calculation for edge cases (0 results, partial page)

---

### PB-05: Add Rate Limiting on API Routes

**Severity:** Critical  
**Estimated Hours:** 8h  
**Files Affected:** New `src/lib/rate-limiter.ts` or middleware

**Description:** API routes have no rate limiting. This is a security risk (brute force on login, DoS on order endpoints). Implement rate limiting using an in-memory token bucket (for single-instance) or Upstash Redis (for serverless).

**Database Changes:** None

**Dependencies:** Upstash Redis account (optional, for serverless)

**Acceptance Criteria:**
- [ ] Rate limiter middleware or helper function created
- [ ] Login endpoint: max 5 requests per minute per IP
- [ ] Order submission: max 30 requests per minute per session
- [ ] Staff CRUD: max 20 requests per minute per user
- [ ] Public endpoints: max 100 requests per minute per IP
- [ ] Rate limit headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] 429 response returned with `Retry-After` header when exceeded
- [ ] Configurable limits via environment variables

**Testing Requirements:**
- Integration test: send N+1 requests, verify 429 on Nth+1
- Verify headers are present in response

---

## Phase 2: Security (High — 80 hours)

### SEC-01: Implement Row-Level Security Policies

**Severity:** High  
**Estimated Hours:** 16h  
**Files Affected:** Supabase migration (SQL)

**Description:** All repositories use `supabaseAdmin` (service role) which bypasses Row-Level Security. RLS policies should be implemented on all tables as a defense-in-depth layer. Even though the application uses service role, RLS policies serve as documentation and can be enabled if the application switches to anon key queries.

**Database Changes:** Enable RLS on all tables; create policies for restaurant_id scoping

**Dependencies:** PB-02 (migration system)

**Acceptance Criteria:**
- [ ] RLS enabled on: `restaurants`, `restaurant_users`, `users`, `restaurant_tables`, `table_sessions`, `orders`, `order_items`, `order_item_addons`, `menu_categories`, `menu_items`, `menu_item_variants`, `menu_item_addons`, `attendance_logs`, `notifications`, `requests`, `payment_transactions`, `analytics_*`
- [ ] Each table has `USING` policy that checks `restaurant_id` against session's restaurant
- [ ] `restaurants` table has policy that allows access to authenticated users with matching `restaurant_users` membership
- [ ] RPC functions have `SECURITY DEFINER` set appropriately
- [ ] Documentation added for RLS policy architecture

---

### SEC-02: Create Audit Logging Infrastructure

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:** New `src/modules/audit/` module, new `audit_logs` table

**Description:** Sensitive operations (staff creation, deletion, role changes, setting modifications) are not logged. Create an audit logging system that records who did what and when.

**Database Changes:** Create `audit_logs` table (id, restaurant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, created_at)

**Dependencies:** PB-02 (migration system)

**Acceptance Criteria:**
- [ ] `audit_logs` table created with appropriate indexes
- [ ] `AuditService` created with `log(restaurantId, userId, action, entityType, entityId, oldValues?, newValues?)` method
- [ ] Staff creation, update, deletion operations call `AuditService.log()`
- [ ] Staff role changes call `AuditService.log()`
- [ ] Menu item CRUD operations call `AuditService.log()`
- [ ] Setting changes call `AuditService.log()`
- [ ] API endpoint exposes audit logs for owner role only
- [ ] Audit logs are immutable (INSERT only, no UPDATE/DELETE)

---

### SEC-03: Implement Granular Role-Based Access Control

**Severity:** High  
**Estimated Hours:** 24h  
**Files Affected:** 
- All `src/app/api/dashboard/*/route.ts` files
- New `src/lib/auth/authorization.ts`

**Description:** Currently only binary role checks exist (owner vs. staff). Implement a proper RBAC system with role-based middleware that can be applied to any API route.

**Database Changes:** None (roles already defined in code)

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Create `authorize()` function that accepts required roles as parameter
- [ ] Create permission matrix mapping roles to features
- [ ] Update `requireRestaurantUser()` to return role information
- [ ] Update all dashboard API route handlers to use `authorize()`
- [ ] Menu CRUD: requires owner or manager
- [ ] Settings: requires owner or manager
- [ ] Billing: requires owner, manager, or cashier
- [ ] Kitchen display: requires kitchen role
- [ ] Waiter order entry: requires waiter role
- [ ] Unauthorized access returns 403 JSON response (not redirect)
- [ ] Frontend hides UI elements based on user role

**Testing Requirements:**
- Integration test each endpoint with each role
- Verify 403 for unauthorized roles
- Verify 200 for authorized roles

---

### SEC-04: Replace Host Header Tenant Resolution

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:**
- `src/lib/restaurantResolver.ts`
- `src/modules/core/restaurants/utils/restaurant.mapper.ts`

**Description:** Tenant resolution uses `x-forwarded-host` or `host` header directly, which is vulnerable to Host header injection attacks. An attacker sending a forged `Host` header could be served a different tenant's data. Replace with URL-safe slug-based resolution.

**Database Changes:** Add `slug` column uniqueness constraint (may already exist)

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Remove reliance on `host` header for tenant resolution
- [ ] Use URL path prefix (e.g., `/restaurant-slug/`) or subdomain validated against known domains
- [ ] Host header is used only for validation, not direct resolution
- [ ] If subdomain approach: validate against `resolves` table or known domain pattern
- [ ] If path prefix approach: slug is validated as alphanumeric
- [ ] Fallback to host header for backward compatibility is removed
- [ ] Migration script updates existing restaurants with URL-safe slugs

---

### SEC-05: Add Security Headers

**Severity:** Medium  
**Estimated Hours:** 4h  
**Files Affected:** `next.config.ts`

**Description:** No security headers (CSP, HSTS, X-Frame-Options, etc.) are configured. Next.js supports headers via `next.config.ts`.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `Content-Security-Policy` header configured with restrictive defaults
- [ ] `X-Frame-Options: DENY` configured
- [ ] `X-Content-Type-Options: nosniff` configured
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` configured
- [ ] `Permissions-Policy` configured to restrict camera, microphone, etc.
- [ ] `Strict-Transport-Security` configured for HTTPS enforcement
- [ ] Cloudinary, Supabase, and Leaflet domains whitelisted in CSP

---

### SEC-06: Add CSRF Protection

**Severity:** Medium  
**Estimated Hours:** 8h  
**Files Affected:** New middleware or existing middleware.ts

**Description:** API routes accept requests from any origin with no CSRF protection. Implement CSRF token validation for state-changing requests (POST, PATCH, PUT, DELETE).

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] CSRF token generated and sent to client on login
- [ ] Client includes CSRF token in `X-CSRF-Token` header for all state-changing requests
- [ ] Server validates CSRF token before processing state-changing requests
- [ ] Token is bound to the user's session
- [ ] Token has expiration (same as session)
- [ ] Public endpoints (menu, QR) are exempt from CSRF

---

### SEC-07: Add Environment Variable Validation at Startup

**Severity:** Medium  
**Estimated Hours:** 2h  
**Files Affected:** New `src/lib/env.ts`

**Description:** Missing or incorrect environment variables cause runtime errors. Add a validation schema that checks all required env vars at application startup.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `env.ts` uses Zod to validate all required environment variables
- [ ] Validation runs at module load in server-side code
- [ ] Missing vars throw clear error messages with variable names
- [ ] Optional vars have defaults documented
- [ ] .env.example file created with all variables and documentation

---

## Phase 3: Reliability (High — 40 hours)

### REL-01: Implement Structured Logging

**Severity:** High  
**Estimated Hours:** 16h  
**Files Affected:** All files using `console.error()`, `console.log()`

**Description:** Replace all `console.error()` and `console.log()` calls with a structured logging library (Pino or Winston). Add request IDs, correlation IDs, and log levels.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Pino (or Winston) added to dependencies
- [ ] `src/lib/logger.ts` created with configured logger instance
- [ ] Logger includes: timestamp, level, requestId, module, message, error stack
- [ ] All `console.error("PREFIX:", error)` replaced with `logger.error({ module, error }, "message")`
- [ ] All `console.log()` replaced with appropriate `logger.info()` or `logger.debug()`
- [ ] Middleware generates request ID for each request
- [ ] Request ID passed through service/repository calls
- [ ] Log level configurable via `LOG_LEVEL` environment variable
- [ ] Production logs JSON format for log aggregation tools

**Testing Requirements:**
- Unit test logger output format
- Integration test that request ID flows through request lifecycle

---

### REL-02: Implement Health Check Endpoint

**Severity:** Medium  
**Estimated Hours:** 2h  
**Files Affected:** New `src/app/api/health/route.ts`

**Description:** No health check endpoint exists. Add `/api/health` that verifies database connectivity, auth service availability, and returns basic system status.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `GET /api/health` returns 200 with `{ status: "healthy", timestamp, uptime }`
- [ ] Health check verifies Supabase connectivity (simple query)
- [ ] Health check does NOT expose sensitive information
- [ ] Health check is not rate-limited
- [ ] Health check does NOT require authentication

---

### REL-03: Fix Error Messages as Control Flow

**Severity:** Low  
**Estimated Hours:** 4h  
**Files Affected:** `src/modules/staff/services/staff.service.ts`, `src/app/api/dashboard/staff/route.ts`

**Description:** `staff.service.ts` uses `throw new Error("email_exists")` and `throw new Error("phone_exists")` which are caught by string comparison in the route handler. This is fragile and unmaintainable. Replace with typed error classes.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Create `StaffError` class with error codes enum (EMAIL_EXISTS, PHONE_EXISTS, AUTH_FAILED, PROFILE_FAILED, MEMBERSHIP_FAILED)
- [ ] Service throws typed errors instead of string errors
- [ ] Route handler catches typed errors and returns appropriate responses
- [ ] All other services that use string error messages are similarly refactored

---

### REL-04: Remove Empty Directories and Stub Files

**Severity:** Low  
**Estimated Hours:** 2h  
**Files Affected:** Multiple empty directories and files

**Description:** Several directories in `src/modules/core/` are empty (events, logging, notifications, realtime, workflows, auth, branding, cache, config, errors, permissions). The `src/modules/application/use-cases/` files are empty stubs. These create confusion and increase cognitive load.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Empty directories removed or documented in a README
- [ ] Empty use case stubs removed or implemented
- [ ] If directories have planned implementations, add README.md explaining intent

---

### REL-05: Create .env.example File

**Severity:** Low  
**Estimated Hours:** 1h  
**Files Affected:** New `.env.example` file

**Description:** No `.env.example` exists. New developers must reverse-engineer required environment variables from source code.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `.env.example` contains all required environment variables
- [ ] Each variable has a comment explaining its purpose
- [ ] Sensitive variables are marked as placeholder values
- [ ] Documentation references `.env.example` in setup instructions

---

## Phase 4: Performance (Medium — 48 hours)

### PERF-01: Move Order Filtering to Database Layer

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:**
- `src/modules/orders/repositories/order.repository.ts`
- `src/modules/orders/services/order.service.ts`

**Description:** Order filtering (by status, search) is done entirely in-memory after fetching all orders. Move filtering to database-level WHERE clauses.

**Database Changes:** None existing. Consider adding GIN index for full-text search on relevant columns.

**Dependencies:** PB-04 (pagination on orders)

**Acceptance Criteria:**
- [ ] `getRestaurantOrders()` accepts `status`, `search`, `sort` filter parameters
- [ ] Status filtering uses `.eq("order_status", status)` in query
- [ ] Search filtering uses Supabase `.textSearch()` or `ILIKE` for tracking_token, table_name, customer_name, customer_phone
- [ ] Sort parameter maps to `.order()` clause
- [ ] In-memory `filterOrders()` method removed from service
- [ ] All callers pass filter parameters directly to repository

**Testing Requirements:**
- Integration test with 1000+ orders, verify query time < 100ms with filters
- Verify filtered results match pre-existing in-memory filtering

---

### PERF-02: Add Database Indexes

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:** Migration file (SQL)

**Description:** No verified indexes exist on foreign key columns. Add indexes for all frequently queried columns.

**Database Changes:** Create indexes

**Dependencies:** PB-02 (migration system)

**Acceptance Criteria:**
- [ ] Index on `restaurant_users(restaurant_id)`
- [ ] Index on `restaurant_users(user_id)`
- [ ] Index on `orders(restaurant_id)`
- [ ] Index on `orders(order_status)`
- [ ] Index on `orders(created_at)`
- [ ] Index on `table_sessions(table_id)`
- [ ] Index on `table_sessions(session_token)`
- [ ] Index on `restaurant_tables(restaurant_id)`
- [ ] Index on `restaurant_tables(qr_token)`
- [ ] Index on `users(email)`
- [ ] Index on `users(phone)`
- [ ] Index on `menu_items(category_id)`
- [ ] Composite index on `restaurant_users(restaurant_id, is_active)`
- [ ] Composite index on `orders(restaurant_id, order_status, created_at)`

**Testing Requirements:**
- Run `EXPLAIN ANALYZE` on common queries before and after indexes
- Verify index usage in query plans

---

### PERF-03: Implement Server-Side Caching

**Severity:** Medium  
**Estimated Hours:** 16h  
**Files Affected:** Multiple service files

**Description:** No caching layer exists. Every API call hits Supabase directly. Implement caching using `react.cache()` for server components and optionally Redis for API routes.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Menu items cached with `react.cache()` (changes rarely, fetched frequently)
- [ ] Restaurant settings cached with `react.cache()`
- [ ] Staff profiles cached with TTL of 5 minutes
- [ ] Cache is invalidated when data is modified via API
- [ ] If Redis: `@upstash/redis` added, menu items cached with 10-minute TTL
- [ ] Cache hit ratio measurable via logging

**Testing Requirements:**
- Load test: 100 concurrent requests for menu items
- Verify cache reduces Supabase query count by >80%

---

### PERF-04: Implement Dynamic Imports for Heavy Libraries

**Severity:** Medium  
**Estimated Hours:** 8h  
**Files Affected:** Dashboard page files importing Recharts, Leaflet

**Description:** Recharts, Leaflet, and Radix UI are likely bundled unconditionally in the main JavaScript bundle, increasing initial page load time. Use `next/dynamic` to load them lazily.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Recharts components loaded via `next/dynamic(() => import("recharts"), { ssr: false })`
- [ ] Leaflet components loaded via `next/dynamic(() => import("react-leaflet"), { ssr: false })`
- [ ] Heavy dialog components loaded lazily
- [ ] Bundle analyzer (`@next/bundle-analyzer`) configured to verify reduction
- [ ] Main bundle size reduced by at least 30% after dynamic imports

---

### PERF-05: Fix Staff Repository N+1 Query

**Severity:** Medium  
**Estimated Hours:** 4h  
**Files Affected:** `src/modules/staff/repositories/staff.repository.ts`

**Description:** `getProfiles()` is called separately for search, adding an extra query for every staff listing request. Join the `users` table in the main staff query instead.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Staff query uses Supabase nested select to join `users` table
- [ ] `getProfiles()` method is deprecated or removed
- [ ] Staff listing with search uses single database query
- [ ] Response format unchanged for frontend compatibility

---

## Phase 5: Refactoring (Medium — 56 hours)

### REF-01: Standardize API Response Format

**Severity:** Medium  
**Estimated Hours:** 8h  
**Files Affected:** All `src/app/api/*/route.ts` files

**Description:** API responses use inconsistent formats (some have `success` field, others don't; some use `data`, others use `orders`, `staff`, etc.). Create a standardized response contract.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Create `ApiResponse<T>` type: `{ success: boolean, data?: T, error?: string, meta?: { page?: number, limit?: number, total?: number, totalPages?: number } }`
- [ ] Create helper functions: `apiSuccess(data, meta?)`, `apiError(error, status)`
- [ ] Update all route handlers to use helper functions
- [ ] Frontend API layer updated to expect standardized format
- [ ] Error responses always include `success: false` and `error` string
- [ ] All endpoints return consistent HTTP status codes

---

### REF-02: Remove Use Case Stubs

**Severity:** Low  
**Estimated Hours:** 2h  
**Files Affected:** `src/modules/application/`

**Description:** The use case layer was scaffolded but not implemented. Remove empty stubs. If the use case pattern is intended, implement the first use case (place order) as a proof of concept.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Empty use case files removed or implemented
- [ ] If removed: `application` module directory cleaned up
- [ ] If implemented: place-order use case handles validation, session check, order creation, and event logging

---

### REF-03: Standardize Module Structure

**Severity:** Medium  
**Estimated Hours:** 16h  
**Files Affected:** Multiple modules

**Description:** Some modules follow the service/repository pattern, while others (qr-ordering, waiter) have different structures. Standardize all modules to follow the same pattern.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] All modules have consistent structure: types.ts, schemas.ts, services/, repositories/
- [ ] All repositories extend `BaseRepository`
- [ ] All services extend `BaseService`
- [ ] `qr-ordering` module realigned to use shared base classes
- [ ] Module README files added for modules with complex structure

---

### REF-04: Remove Duplicate Role in users Table

**Severity:** Medium  
**Estimated Hours:** 4h  
**Files Affected:** Migration file, staff.service.ts, staff.repository.ts

**Description:** The `users` table stores `role` alongside `restaurant_users.role`. This duplication can lead to inconsistent role assignments. Remove the role field from `users` table or add a sync mechanism.

**Database Changes:** Remove `role` column from `users` table (migration)

**Dependencies:** PB-02 (migration system)

**Acceptance Criteria:**
- [ ] Migration removes `role` column from `users` table
- [ ] All code that reads from `users.role` is updated to read from `restaurant_users.role`
- [ ] All code that writes to `users.role` is updated to write only to `restaurant_users.role`
- [ ] Staff service create/update no longer writes role to users table

---

### REF-05: Remove Unused Dependencies

**Severity:** Low  
**Estimated Hours:** 1h  
**Files Affected:** `package.json`

**Description:** `react-hot-toast` is installed alongside `sonner` — both serve the same purpose. Remove one.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Determine which toast library is actively used (inspect imports)
- [ ] Remove unused toast library from package.json
- [ ] Verify no broken imports after removal

---

### REF-06: Create Shared API Response Types

**Severity:** Low  
**Estimated Hours:** 4h  
**Files Affected:** New `src/lib/api-response.ts`

**Description:** No shared TypeScript types exist for API responses between frontend and backend. Create a shared type definition.

**Database Changes:** None

**Dependencies:** REF-01

**Acceptance Criteria:**
- [ ] `src/lib/api-response.ts` contains `ApiResponse<T>`, `PaginatedResponse<T>`, `ErrorResponse` types
- [ ] Route handlers use these types for response generation
- [ ] Frontend API client uses these types for response parsing
- [ ] Type safety ensured — frontend knows exact response shape

---

## Phase 6: Testing (High — 120 hours)

### TST-01: Set Up Testing Infrastructure

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:** New configuration files

**Description:** No testing framework or configuration exists. Set up Vitest for unit/integration tests and Playwright for E2E tests.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Vitest installed and configured (`vitest.config.ts`)
- [ ] Test script added to package.json: `npm run test`, `npm run test:watch`, `npm run test:coverage`
- [ ] Playwright installed and configured
- [ ] Test database setup documented (Supabase local or test project)
- [ ] CI configured to run tests on every PR

**Testing Requirements:**
- Verify `npm run test` runs and shows 0 tests (pass)
- Verify test coverage reporting works

---

### TST-02: Write Unit Tests for Services

**Severity:** High  
**Estimated Hours:** 32h  
**Files Affected:** New `src/modules/*/__tests__/*.test.ts` files

**Description:** Services contain business logic but have no tests. Write comprehensive unit tests for all service classes.

**Database Changes:** None

**Dependencies:** TST-01

**Acceptance Criteria:**
- [ ] `StaffService`: tests for create, update, delete, getRestaurantStaff (with mocks)
- [ ] `OrderService`: tests for getDashboardData, getKitchenDashboardData, filterOrders, getCounts, getTodayRevenue
- [ ] `SessionService`: tests for getOrCreateActiveSession, completeSession, expireSession, markBillRequested
- [ ] `SessionLifecycleService`: tests for canUse, canPlaceOrder, canRequestBill, canComplete, canExpire, canRecover
- [ ] `TableService`: tests for all mark* methods
- [ ] `StaffRepository`: tests for query building (not integration)
- [ ] All tests use mocked Supabase client
- [ ] Minimum 80% line coverage on service files

---

### TST-03: Write Integration Tests for API Routes

**Severity:** High  
**Estimated Hours:** 40h  
**Files Affected:** New `src/app/api/__tests__/*.test.ts` files

**Description:** API route handlers have no integration tests. Write tests that verify route handler behavior with a test Supabase database.

**Database Changes:** None

**Dependencies:** TST-01, PB-02 (test database with migrations)

**Acceptance Criteria:**
- [ ] Staff API: test GET (list), POST (create), PATCH (update), DELETE (delete), PUT (status)
- [ ] Auth flow: test login, redirect, session validation
- [ ] Tenant isolation: test cross-tenant data access is blocked
- [ ] Authorization: test role-based access for each endpoint
- [ ] Validation: test invalid inputs return 400 with descriptive errors
- [ ] Test database is seeded with known data
- [ ] Tests are idempotent (can run multiple times)
- [ ] Tests clean up after themselves

---

### TST-04: Write E2E Tests for Critical Flows

**Severity:** Medium  
**Estimated Hours:** 24h  
**Files Affected:** New `e2e/` directory

**Description:** E2E tests for critical user flows using Playwright.

**Database Changes:** None

**Dependencies:** TST-01

**Acceptance Criteria:**
- [ ] Login flow: navigate to /login, enter credentials, verify redirect to /dashboard
- [ ] Staff management: create new staff, verify in list, edit, delete
- [ ] QR ordering flow: navigate to QR page, add items to cart, submit order (mocked)
- [ ] Order management: view orders, filter by status
- [ ] Mobile responsiveness: test dashboard on mobile viewport
- [ ] Tests run against production build (not dev server)

---

### TST-05: Write Load Tests for Critical Endpoints

**Severity:** Low  
**Estimated Hours:** 16h  
**Files Affected:** New `load-tests/` directory

**Description:** Verify the application can handle expected production load.

**Database Changes:** None

**Dependencies:** TST-01

**Acceptance Criteria:**
- [ ] k6 (or Artillery) scripts for: order submission, menu listing, staff listing, login
- [ ] 100 concurrent users for 5 minutes without errors
- [ ] P95 response time < 500ms for all endpoints
- [ ] P99 response time < 1000ms for all endpoints
- [ ] Test results documented in load-test-report.md

---

## Phase 7: Deployment & Monitoring (Medium — 40 hours)

### DEP-01: Set Up CI/CD Pipeline

**Severity:** Medium  
**Estimated Hours:** 12h  
**Files Affected:** New `.github/workflows/` directory

**Description:** No CI pipeline exists. Only Netlify auto-deploy. Set up GitHub Actions for linting, type checking, testing, and deployment.

**Database Changes:** None

**Dependencies:** TST-01

**Acceptance Criteria:**
- [ ] GitHub Actions workflow created
- [ ] `lint` job runs `npm run lint`
- [ ] `typecheck` job runs `npm run typecheck`
- [ ] `test` job runs `npm run test` (unit + integration)
- [ ] `build` job runs `npm run build`
- [ ] `deploy` job deploys to Netlify preview on PR
- [ ] `deploy` job deploys to Netlify production on main branch merge
- [ ] Workflow caches node_modules for fast runs
- [ ] Test results published as PR comments

---

### DEP-02: Set Up Error Tracking

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:** New `src/lib/error-tracking.ts`

**Description:** No error tracking service exists. Add Sentry for production error monitoring.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] `@sentry/nextjs` installed and configured
- [ ] Sentry DSN in environment variables
- [ ] All API route errors captured by Sentry
- [ ] Unhandled promise rejections captured
- [ ] Source maps uploaded to Sentry for readable stack traces
- [ ] Performance tracing enabled for key operations
- [ ] Sentry release tracking connected to CI/CD

---

### DEP-03: Set Up Monitoring & Alerts

**Severity:** Medium  
**Estimated Hours:** 8h  
**Files Affected:** New monitoring configuration

**Description:** No monitoring or alerting exists. Set up Supabase monitoring and custom health check monitoring.

**Database Changes:** None

**Dependencies:** REL-02 (health check)

**Acceptance Criteria:**
- [ ] Supabase project monitoring enabled (built-in)
- [ ] External monitoring service (Better Uptime, Pingdom, or similar) checks `/api/health` every 5 minutes
- [ ] Alert on health check failure (email/Slack/PagerDuty)
- [ ] Alert on Supabase database CPU > 80%
- [ ] Alert on API error rate > 1%
- [ ] Dashboard shows key metrics: response time, error rate, active users, orders/hour

---

### DEP-04: Configure Database Backup & Disaster Recovery

**Severity:** High  
**Estimated Hours:** 8h  
**Files Affected:** Documentation only

**Description:** No documented backup or disaster recovery strategy.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Supabase Point-in-Time Recovery (PITR) enabled
- [ ] Daily backup automated and verified
- [ ] Disaster recovery document created:
  - Restore from backup procedure
  - Failover plan for Supabase outage
  - Rollback procedure for failed deployments
  - Contact list for critical incidents
- [ ] Recovery tested in staging environment

---

### DEP-05: Configure CDN and Domains

**Severity:** Medium  
**Estimated Hours:** 4h  
**Files Affected:** `netlify.toml`

**Description:** No CDN configuration exists. Optimize static asset delivery and configure custom domains.

**Database Changes:** None

**Dependencies:** None

**Acceptance Criteria:**
- [ ] Netlify CDN configured for static assets
- [ ] Custom domain configured for main app
- [ ] Wildcard subdomain configured for tenant subdomains (if applicable)
- [ ] SSL certificates provisioned (auto via Netlify)
- [ ] Cache headers optimized for static assets (1 year cache for hashed files)
- [ ] Redirect rules documented in netlify.toml

---

## Summary: Implementation Order

```
Phase 1: Launch Blockers (64h) ──────────────────────┐
  PB-01: Tenant Isolation Fixes          8h          │
  PB-02: Database Migrations            40h          │←─ Required by PB-03
  PB-03: Database Transactions          16h          │
  PB-04: Orders Pagination               4h          │
  PB-05: Rate Limiting                   8h          │
                           ─────────────────         │
                           64h total                 │
                                                     ▼
Phase 2: Security (80h) ─────────────────────────────┐
  SEC-01: RLS Policies                  16h          │
  SEC-02: Audit Logging                  8h          │
  SEC-03: RBAC                          24h          │
  SEC-04: Host Header Fix                8h          │
  SEC-05: Security Headers               4h          │
  SEC-06: CSRF Protection                8h          │
  SEC-07: Env Validation                 2h          │
                           ─────────────────         │
                           80h total                 │
                                                     ▼
Phase 3: Reliability (40h) ──────────────────────────┐
  REL-01: Structured Logging            16h          │
  REL-02: Health Check                    2h          │
  REL-03: Error Classes                   4h          │
  REL-04: Remove Dead Code                2h          │
  REL-05: .env.example                    1h          │
                           ─────────────────         │
                           40h total                 │
                                                     ▼
Phase 4: Performance (48h) ──────────────────────────┐
  PERF-01: DB-Level Order Filtering       8h          │
  PERF-02: Database Indexes               8h          │
  PERF-03: Server-Side Caching           16h          │
  PERF-04: Dynamic Imports                8h          │
  PERF-05: Fix N+1 Query                  4h          │
                           ─────────────────         │
                           48h total                 │
                                                     ▼
Phase 5: Refactoring (56h) ──────────────────────────┐
  REF-01: API Response Standard           8h          │
  REF-02: Use Case Stubs                   2h          │
  REF-03: Module Structure               16h          │
  REF-04: Remove Duplicate Role            4h          │
  REF-05: Remove Unused Deps               1h          │
  REF-06: Shared API Types                 4h          │
                           ─────────────────         │
                           56h total                 │
                                                     ▼
Phase 6: Testing (120h) ─────────────────────────────┐
  TST-01: Test Infrastructure              8h          │
  TST-02: Unit Tests                      32h          │
  TST-03: Integration Tests               40h          │
  TST-04: E2E Tests                       24h          │
  TST-05: Load Tests                      16h          │
                           ─────────────────         │
                          120h total                 │
                                                     ▼
Phase 7: Deployment (40h) ───────────────────────────┐
  DEP-01: CI/CD Pipeline                  12h          │
  DEP-02: Error Tracking                   8h          │
  DEP-03: Monitoring & Alerts              8h          │
  DEP-04: Backup & Disaster Recovery       8h          │
  DEP-05: CDN & Domains                    4h          │
                           ─────────────────         │
                           40h total                 │
                                                     ▼
               Total: 448 hours (~6 weeks, 2 devs)
```

---

## Task Tracking

Each task in this roadmap should be tracked as a GitHub Issue with:

- **Label:** Phase (e.g., `phase-1-launch-blockers`)
- **Label:** Severity (e.g., `severity-critical`)
- **Label:** Area (e.g., `area-security`, `area-performance`)
- **Assignee:** Developer
- **Milestone:** Phase number
- **Checklist:** Acceptance criteria items (from this document)
- **Linked PR:** Implementation pull request

Suggested GitHub Labels:

```
phase-1-launch-blockers
phase-2-security
phase-3-reliability
phase-4-performance
phase-5-refactoring
phase-6-testing
phase-7-deployment
severity-critical
severity-high
severity-medium
severity-low
area-security
area-performance
area-database
area-api
area-frontend
area-testing
area-devops
```

---

*Roadmap generated from production readiness audit. Last updated: July 2026.*