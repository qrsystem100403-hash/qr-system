# Restaurant SaaS Database Standards

Version: 1.0

Status:
ARCHITECTURE LOCKED

These standards are mandatory for every future table,
migration, trigger, function and RLS policy.

Violation of these standards requires architectural review.

---

# 1. Database Philosophy

The database is the source of truth.

Business rules belong in:

Database
↓

Service Layer
↓

API

Never inside UI.

The frontend only displays data.

---

# 2. Multi Tenancy

Every business entity belongs to exactly one restaurant.

Every business table must contain

restaurant_id UUID NOT NULL

unless it is:

• global configuration
• lookup table
• system table

Restaurant isolation is enforced using RLS.

No query may access another restaurant's data.

---

# 3. Primary Keys

Every table

id UUID

generated using

gen_random_uuid()

Never use SERIAL.

Never expose sequential IDs.

---

# 4. Timestamps

Mutable tables

created_at

updated_at

Immutable tables

created_at

updated_at must always be maintained
using database triggers.

Application code must never update timestamps manually.

---

# 5. Naming Convention

Tables

snake_case

Columns

snake_case

Indexes

table_column_idx

Unique Index

table_column_unique

Policies

table_action

Examples

orders_select

orders_update

menu_items_insert

Functions

verb_noun()

Examples

current_restaurant_id()

has_restaurant_role()

is_restaurant_owner()

---

# 6. Foreign Keys

Every relationship must use FK constraints.

ON DELETE

chosen intentionally.

Never leave defaults without review.

Rules

Configuration → CASCADE

History → RESTRICT

Snapshots → NO ACTION

Reference Data → SET NULL (only if appropriate)

---

# 7. Row Level Security

Every business table must have RLS enabled.

Policies must use helper functions.

Never duplicate EXISTS() logic.

Preferred

is_restaurant_member()

is_restaurant_owner()

has_restaurant_role()

Never use

USING (true)

except for truly public data.

---

# 8. Authorization

Current model

Owner

Manager

Cashier

Kitchen

Waiter

Future roles may be added.

Do not hardcode role checks inside services.

Use helper functions.

---

# 9. Business Snapshots

Transactional history is immutable.

Orders must keep

item_name

item_price

variant_name

addon_name

GST

Service Charge

Round Off

Billing Configuration

Never read current menu values
for historical orders.

---

# 10. Calculated Data

Never store values
that can always be calculated.

Bad

active_orders

Good

COUNT(*)

Exception

Financial snapshots.

---

# 11. Configuration

Restaurant identity

restaurants

Business configuration

restaurant_settings

Billing

restaurant_billing_settings

Feature Flags

restaurant_features

Never mix configuration with operational data.

---

# 12. Themes

Theme configuration is not UI code.

Database stores

theme_id

Frontend resolves

colors

fonts

spacing

radius

layouts

No CSS values inside database.

---

# 13. Soft Delete Policy

Restaurant

Never delete

Restaurant User

Deactivate

Menu

Archive

Orders

Never delete

Attendance

Never delete

Notifications

Delete allowed

Requests

Keep history

---

# 14. Audit Logging

Critical actions must be logged.

Examples

GST changes

Feature changes

Menu changes

Order cancellation

Attendance override

Staff creation

Future table

audit_logs

---

# 15. Index Strategy

Every FK

Indexed

Every lookup

Indexed

Every unique field

Unique Index

No duplicate indexes.

Indexes reviewed before release.

---

# 16. Constraints

Prefer CHECK constraints
over frontend validation.

Examples

Positive prices

Valid percentages

Valid enums

Non-negative quantities

Database protects itself.

---

# 17. Enums

Use PostgreSQL ENUM

only when values are stable.

Examples

Order Status

Attendance Status

Session Status

Do not use ENUM
for rapidly changing business data.

---

# 18. Functions

Business functions belong in database.

Examples

Billing calculations

Permissions

Workflow validation

Updated timestamps

Never duplicate SQL logic
inside multiple services.

---

# 19. Migrations

Every migration

Reviewed

Reversible where practical

Idempotent when possible

Named clearly

Never modify production manually.

---

# 20. SaaS Principles

One codebase.

Unlimited restaurants.

No restaurant-specific code.

Everything configurable.

Deployment should require only:

Create Restaurant

↓

Assign Owner

↓

Enable Modules

↓

Configure Billing

↓

Generate QR

↓

Ready

No developer intervention.

---

# Architecture Goals

Scalable

Maintainable

Secure

Multi Tenant

Production Ready

Developer Friendly

Future Proof