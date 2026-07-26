# Order Module Refactor Progress

**Version:** 1.0
**Status:** In Progress
**Last Updated:** July 2026

---

# Purpose

This document tracks the architectural refactor of the Order Module.

The goal is to transform the module from a route-centric implementation into a production-grade layered architecture that is:

- Maintainable
- Testable
- Scalable
- Multi-tenant
- Easy to extend

This document should be updated after every major refactor.

---

# Overall Architecture

The order module now follows:

Route
↓

Validation
↓

Services
↓

Repositories
↓

Supabase

Business logic never directly accesses Supabase.

Repositories never contain business logic.

Routes never contain business logic.

---

# Layer Responsibilities

## Route

Responsibilities

- Parse request
- Validate schema
- Resolve tenant
- Return HTTP response
- Convert AppError → HTTP

Should NOT

- Calculate billing
- Validate menu
- Create sessions
- Perform SQL
- Build order items

---

## Services

Services contain business rules.

Current services:

- OrderBillingService
- OrderCreateService
- OrderMenuValidationService
- OrderRateLimitService
- OrderRequestValidationService
- OrderSessionService
- OrderTableService

Responsibilities

- Business validation
- Workflow
- Pricing
- Menu validation
- Session management
- Rate limiting

---

## Repository Layer

Repositories perform database access only.

No business logic.

Current repositories

### OrderRepository

Responsibilities

- Restaurant orders
- Status updates
- Payment updates
- Session order lookup
- Recent order count

Removed responsibilities

- Menu
- Billing

---

### OrderCreateRepository

Responsibilities

- Create order
- Create order items
- Create order addons
- Rollback helper queries

---

### OrderSessionRepository

Responsibilities

- Session persistence

---

### OrderRateLimitRepository

Responsibilities

- Recent order count

---

### OrderTableRepository

Responsibilities

- QR table lookup

---

### MenuRepository

(New)

Responsibilities

- Menu items
- Variants
- Addons
- Categories

Reason

Menu data does not belong inside OrderRepository.

---

### BillingRepository

(New)

Responsibilities

- Restaurant billing settings

Reason

Billing configuration is its own domain.

---

# Dependency Injection

Added:

modules/orders/container.ts

Purpose

Centralized service construction.

Instead of:

new Service()

inside routes

Routes now consume

- orderCreateService
- orderBillingService
- orderMenuValidationService
- orderRateLimitService
- orderSessionService
- orderTableService
- requestValidationService

Future goal

Entire project should use dependency injection.

---

# Validation Refactor

Created

OrderRequestValidationService

Responsibilities

- Total quantity validation
- Grand total validation

Removed validation logic from routes.

---

# Menu Validation Refactor

Created

OrderMenuValidationService

Responsibilities

- Item validation
- Variant validation
- Addon validation
- Category time validation
- Duplicate cart validation

Returns

validatedCart

instead of raw cart.

This ensures pricing always comes from database.

Never trust frontend prices.

---

# Billing Refactor

Created

OrderBillingService

Responsibilities

- Calculate subtotal
- GST
- Service charge
- Round off
- Grand total

Uses

BillingRepository

instead of OrderRepository.

---

# Session Refactor

Created

OrderSessionService

Responsibilities

- Existing session lookup
- Session creation
- Table occupancy
- Session touch

Routes no longer manage session lifecycle.

---

# Rate Limiting

Created

OrderRateLimitService

Responsibilities

- Prevent excessive QR orders

Current rule

Maximum

10 orders

within

5 minutes

per table.

---

# Error Handling

Created centralized error hierarchy.

AppError

↓

ValidationError

↓

DatabaseError

↓

RateLimitError

↓

ConflictError

↓

NotFoundError

↓

UnauthorizedError

↓

ForbiddenError

↓

InternalServerError

Routes now catch

AppError

and return

status

from error object.

---

# Type Improvements

Created shared types.

Examples

ValidatedCartItem

BillingSettings

BillingCalculation

CreateOrderPayload

CreateOrderItemPayload

CreateOrderItemAddonPayload

Goal

Avoid anonymous inline types.

---

# Repository Separation

Old

OrderRepository

Contained

- Orders
- Menu
- Billing

New

OrderRepository

Contains

Only order queries.

MenuRepository

Contains

- Menu items
- Variants
- Addons
- Categories

BillingRepository

Contains

- Billing settings

This follows

Single Responsibility Principle.

---

# Business Rules

Current business rules

✔ Duplicate cart prevention

✔ Category availability

✔ Parent category availability

✔ Menu availability

✔ Variant availability

✔ Addon availability

✔ Billing calculation

✔ Session validation

✔ Table validation

✔ Rate limiting

✔ Grand total validation

✔ Total quantity validation

---

# Security Decisions

Frontend prices are ignored.

Prices always come from database.

Variants always validated.

Addons always validated.

Restaurant isolation enforced.

Session must belong to table.

Table token validated.

---

# Architectural Decisions

Decision 1

Routes should orchestrate only.

Decision 2

Repositories never contain business logic.

Decision 3

Services own workflows.

Decision 4

Repositories own SQL.

Decision 5

Validation belongs in services.

Decision 6

Billing belongs to Billing module.

Decision 7

Menu belongs to Menu module.

Decision 8

Use dependency injection instead of creating services inside routes.

Decision 9

Never trust frontend calculations.

Decision 10

Shared types instead of inline object definitions.

---

# Known Pending Work

## Database Transactions

Currently

Order creation uses manual rollback.

Future

Move to PostgreSQL transaction/RPC.

Priority

HIGH

---

## Workflow Engine

Current waiter route references

WORKFLOWS

This module has not been implemented.

Reason

Dashboard work postponed.

Status

Deferred.

---

## Logging

Current

console.info

console.error

Future

Central Logger service.

Priority

Medium

---

## Notification Queue

Current

Notification created synchronously.

Future

Background queue.

Priority

Medium

---

## Unit Testing

Services currently have no automated tests.

Future

Vitest

Repository mocking

Priority

High

---

# Current Module Health

Architecture

★★★★★

Repository Design

★★★★★

Business Separation

★★★★★

Scalability

★★★★★

Maintainability

★★★★★

Production Readiness

★★★★☆

Missing items

- Transactions
- Workflow engine
- Background jobs
- Tests

---

# Next Phase

After this refactor the next major milestone is:

## Staff Dashboard

Modules

- Waiter Dashboard
- Kitchen Dashboard
- Cashier Dashboard

Implement

Production Workflow Engine

instead of placeholder workflow logic.

Only after the workflow engine is complete should the waiter API routes be finalized.

---

END OF DOCUMENT