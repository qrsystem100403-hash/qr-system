# DATABASE_ARCHITECTURE.md

> **Version:** 1.0
> **Project:** Restaurant SaaS Platform
> **Database:** PostgreSQL (Supabase)
> **Status:** Living Document
> **Last Updated:** _(Update whenever schema changes)_

---

# 1. Executive Summary

This document is the **single source of truth** for the database architecture of the Restaurant SaaS.

Its purpose is to help developers understand:

- Database design
- Multi-tenant architecture
- Relationships
- Security model
- Performance
- RLS
- Indexes
- Functions
- Constraints
- Future migrations

without opening Supabase.

---

# 2. Database Overview

## Database Engine

- PostgreSQL
- Hosted on Supabase

---

## Architecture

Multi-Tenant

```
Restaurant
    │
    ├── Staff
    ├── Menu
    ├── Tables
    ├── Orders
    ├── Attendance
    ├── Notifications
    └── Settings
```

Each restaurant owns its own data.

Tenant isolation is primarily enforced through:

- restaurant_id
- Repository Layer
- Application Authorization
- Row Level Security (RLS)

---

## Current Statistics

### Public Tables

18

```
attendance_logs
menu_categories
menu_item_addons
menu_item_variants
menu_items
notifications
order_item_addons
order_items
orders
requests
restaurant_billing_settings
restaurant_features
restaurant_modules
restaurant_tables
restaurant_users
restaurants
table_sessions
users
```

---

## Functions

```
cleanup_old_notifications()

generate_order_tracking_token()

get_next_employee_id()

is_restaurant_owner()

is_restaurant_manager()

is_restaurant_staff()
```

---

# 3. Database Design Principles

## UUID Everywhere

Every entity uses UUID.

Advantages

- globally unique
- secure
- impossible to enumerate
- easy replication

---

## Multi Tenant

Every business table contains

```
restaurant_id
```

This is the tenant boundary.

---

## Repository Pattern

Application never queries database directly.

Flow

```
Route

↓

Service

↓

Repository

↓

Supabase

↓

Database
```

---

## Business Logic

Business logic stays inside Services.

Database only contains

- constraints
- indexes
- RLS
- helper functions

---

# 4. Entity Relationship Diagram

```
Restaurants
    │
    ├──────────────┐
    │              │
    │              │
Restaurant Users   Restaurant Tables
    │              │
    │              │
Attendance Logs    Table Sessions
                      │
                      │
                    Orders
                      │
          ┌───────────┴───────────┐
          │                       │
     Order Items          Notifications
          │
          │
Order Item Addons

Restaurants
    │
    │
Menu Categories
      │
      │
 Menu Items
      │
 ┌────┴────┐
 │         │
Variants  Addons
```

---

# 5. Core Database Modules

## Restaurant Management

Tables

```
restaurants

restaurant_users

restaurant_modules

restaurant_features

restaurant_billing_settings
```

Purpose

Owns entire tenant.

---

## Menu Module

```
menu_categories

menu_items

menu_item_variants

menu_item_addons
```

Purpose

Restaurant menu.

---

## Table Module

```
restaurant_tables

table_sessions
```

Purpose

Physical tables.

QR Sessions.

---

## Order Module

```
orders

order_items

order_item_addons
```

Purpose

Customer ordering.

---

## Attendance Module

```
attendance_logs
```

Purpose

Employee attendance.

GPS

Shifts

Overtime

Late Arrival

---

## Notification Module

```
notifications
```

Purpose

Realtime notifications.

---

# 6. Table Reference

For EVERY table maintain:

## Example

### orders

Purpose

Stores customer orders.

Columns

| Column | Type | Notes |
|----------|----------|------|
| id | uuid | PK |
| restaurant_id | uuid | FK |
| session_id | uuid | FK |
| table_id | uuid | FK |
| order_type | text | dine_in etc |
| order_status | text | pending etc |
| payment_status | text | pending etc |
| total | numeric | final amount |
| created_at | timestamptz | created |
| updated_at | timestamptz | updated |

Relationships

```
Restaurant

↓

Orders

↓

Order Items

↓

Addons
```

Indexes

```
restaurant_created_idx

restaurant_status_idx

tracking_token_idx

session_idx
```

RLS

- Public Insert (QR)
- Restaurant Select
- Restaurant Update

Used By

Repositories

Services

API

Dashboard

QR

Performance Notes

Future Improvements

Repeat for every table.

---

# 7. Foreign Keys

Document every FK.

Example

```
attendance_logs.restaurant_id

↓

restaurants.id

Delete

CASCADE
```

Business Reason

Deleting restaurant removes attendance.

---

Example

```
menu_items.category_id

↓

menu_categories.id

Delete

SET NULL
```

Reason

Deleting category should not delete menu items.

---

Example

```
orders.session_id

↓

table_sessions.id

Delete

NO ACTION
```

Reason

Historical order integrity.

---

# 8. Index Documentation

Every index should include

Name

Columns

Unique?

Purpose

Typical Query

Example

```
orders_restaurant_created_idx

restaurant_id

created_at DESC
```

Used for

Dashboard order history.

---

Partial Index

```
idx_table_active_session
```

Purpose

Only one active session per table.

---

# 9. RLS Documentation

For every table document

SELECT

INSERT

UPDATE

DELETE

Explain policy in plain English.

Example

Orders

Public

INSERT

Allowed only when

- pending
- dine_in
- payment pending

Restaurant Users

SELECT

Only users belonging to same restaurant.

---

# 10. Functions

Document every function.

Example

## generate_order_tracking_token()

Purpose

Generate unique order tracking token.

Called By

Order Service.

---

## get_next_employee_id()

Purpose

Auto increment employee IDs.

---

## cleanup_old_notifications()

Purpose

Deletes expired notifications.

---

## is_restaurant_owner()

Authorization helper.

---

## is_restaurant_manager()

Authorization helper.

---

## is_restaurant_staff()

Authorization helper.

---

# 11. Query Patterns

Typical queries.

Dashboard Orders

```
Restaurant

↓

Orders

↓

Order Items
```

Kitchen

```
Restaurant

↓

Pending Orders
```

Attendance

```
Restaurant

↓

Attendance Logs
```

Menu

```
Restaurant

↓

Categories

↓

Items

↓

Variants
```

---

# 12. Performance Analysis

Current Strengths

✅ UUID PK

✅ Composite Indexes

✅ Partial Index

✅ Tenant Indexes

✅ Unique Constraints

---

Needs Improvement

- More transaction support
- Additional reporting indexes
- Remove duplicate indexes
- Remove legacy category column
- Query optimization

---

# 13. Security

Current

✅ RLS

✅ FK

✅ UUID

✅ Tenant Isolation

✅ Service Layer

Needs Improvement

- Transaction safety
- Rate limiting
- Audit logs
- Better role enforcement
- Logging

---

# 14. Database Conventions

Primary Keys

```
id
```

Tenant Key

```
restaurant_id
```

Foreign Keys

```
xxx_id
```

Created Timestamp

```
created_at
```

Updated Timestamp

```
updated_at
```

Boolean

```
is_xxx
```

---

# 15. Production Readiness

Current Score

Architecture

9.0

Schema

9.0

Indexes

9.0

Relationships

9.0

Security

8.5

Performance

8.5

Overall Database

≈ 8.8 / 10

---

# 16. Future Improvements

High Priority

- Database Transactions
- Idempotency
- Audit Logs
- API Consistency
- Structured Logging

Medium Priority

- Better Reporting Indexes
- Materialized Views
- Analytics Tables
- Background Jobs

Future

- Inventory
- Payments
- Loyalty
- Coupons
- Reservations

---

# 17. Database Cheat Sheet

## Tenant

```
restaurant_id
```

## Core Tables

```
restaurants

restaurant_users

restaurant_tables

table_sessions

orders

order_items

menu_items
```

## Order Flow

```
Restaurant

↓

Table

↓

Session

↓

Order

↓

Items

↓

Addons
```

## Menu Flow

```
Restaurant

↓

Category

↓

Item

↓

Variant

↓

Addon
```

## Attendance Flow

```
Restaurant

↓

Employee

↓

Attendance Log
```

## Authentication

```
Supabase Auth

↓

users

↓

restaurant_users

↓

roles
```

---

# 18. Change Log

Whenever schema changes, update this file.

Record:

Date

Migration

Reason

Affected Tables

Developer

Never allow this document to become outdated.

---

# Notes

This document should always stay synchronized with:

- PROJECT_ARCHITECTURE.md
- DEPENDENCY_GRAPH.md
- PRODUCTION_ROADMAP.md

These four documents together represent the complete engineering documentation for the Restaurant SaaS.