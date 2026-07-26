# SAAS_OPERATIONS.md

> **Version:** 1.0
> **Project:** Restaurant SaaS Platform
> **Status:** Living Document
> **Purpose:** Defines how the SaaS is developed, deployed, maintained, scaled, and operated.
>
> **This document is the operating manual for the company, not the application.**

---

# Vision

This project is **NOT** a custom restaurant management system.

It is a **Commercial Multi-Tenant Restaurant SaaS Platform**.

Every engineering decision must move us toward:

- One Codebase
- Unlimited Restaurants
- Unlimited Domains
- Unlimited Growth

The objective is to build software that can confidently serve restaurants ranging from a small café to a national chain.

---

# Core Philosophy

## Rule #1

**One Codebase**

Never maintain separate codebases for different restaurants.

---

## Rule #2

**One Production Build**

Every restaurant runs the exact same application.

Only configuration changes.

---

## Rule #3

**Everything is Configurable**

Restaurant-specific behavior belongs in the database.

Never hardcode.

---

## Rule #4

**Every Bug Fix Benefits Everyone**

One fix.

One deployment.

Every customer receives it.

---

## Rule #5

**No Client Forks**

Forking code is the absolute last option.

---

# SaaS Architecture

```
                    GitHub Repository
                           │
                           ▼
                    Main Branch
                           │
                           ▼
                     CI / CD Pipeline
                           │
                           ▼
                   Production Deployment
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
restaurant-a.com    restaurant-b.com   restaurant-c.com
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                 Same Next.js Application
                           │
                           ▼
                  Detect Incoming Domain
                           │
                           ▼
                Find Restaurant in Database
                           │
                           ▼
              Load Branding + Features + Data
                           │
                           ▼
                    Render Application
```

---

# One Codebase Strategy

The application must always remain a single codebase.

Never create:

```
Restaurant A Source Code

Restaurant B Source Code

Restaurant C Source Code
```

Instead:

```
One Source Code

↓

Many Restaurants

↓

Many Domains
```

---

# Client Isolation

Every client is isolated using:

- restaurant_id
- RLS
- Repository Layer
- Application Authorization

Never through separate source code.

---

# Domain Strategy

Every restaurant owns its own domain.

Example:

```
pizzaworld.com

burgerhouse.com

cafecorner.com

hotelroyal.com
```

All domains point to the same deployed application.

The application determines the restaurant using the Host Header.

```
Incoming Request

↓

Host Header

↓

restaurant_domains

↓

Restaurant ID

↓

Load Restaurant
```

---

# Restaurant Domains Table

Future table:

```
restaurant_domains

id

restaurant_id

domain

subdomain

is_primary

ssl_enabled

status

created_at
```

---

# Branding System

Branding must come entirely from the database.

Never modify CSS for individual restaurants.

Branding includes:

- Logo
- Favicon
- Primary Color
- Secondary Color
- Accent Color
- Background
- Font
- Hero Image
- QR Theme
- Landing Theme

Future table:

```
restaurant_branding

restaurant_id

logo_url

favicon_url

primary_color

secondary_color

accent_color

background_color

font_family

button_radius

theme
```

---

# Theme System

The application reads branding dynamically.

Example:

```
Restaurant

↓

Branding

↓

CSS Variables

↓

UI
```

Instead of changing code.

---

# Landing Pages

Landing pages should become configurable.

Examples:

```
Modern

Minimal

Luxury

Cafe

Hotel

Cloud Kitchen
```

Stored as:

```
landing_layout
```

Never separate repositories.

---

# Feature Flag System

Every module should be controlled by the database.

Example:

```
Orders

true

Kitchen

true

Attendance

true

Inventory

false

Reservations

false

CRM

false
```

Application decides what to render.

---

# Module Management

Modules may include:

- Orders
- QR
- Tables
- Kitchen
- Billing
- Attendance
- Analytics
- Inventory
- Reservations
- Loyalty
- CRM
- Reports
- Marketing

Every module can be enabled or disabled.

---

# Restaurant Settings

Every restaurant has configurable settings.

Examples:

- Currency
- Timezone
- Language
- Tax
- Order Flow
- Payment Methods
- Date Format
- Receipt Format
- Theme
- Layout

Nothing should be hardcoded.

---

# Client Onboarding Process

Every new restaurant follows the exact same process.

```
Create Restaurant

↓

Create Owner

↓

Create Staff

↓

Configure Domain

↓

Configure Branding

↓

Configure Features

↓

Configure Modules

↓

Upload Assets

↓

Generate QR

↓

Go Live
```

---

# Deployment Strategy

Development Flow

```
Developer

↓

Git Commit

↓

Git Push

↓

GitHub

↓

CI/CD

↓

Production

↓

Every Restaurant Updated
```

There is **only one deployment**.

---

# Bug Fix Workflow

Suppose a bug exists in:

```
OrderService.ts
```

Fix:

```
Edit Code

↓

Commit

↓

Push

↓

Deploy

↓

Every Restaurant Updated
```

Never manually update each client.

---

# Client Customization Policy

Every customization must be classified.

## Category A

Useful for multiple restaurants.

Build as:

Feature

---

## Category B

Only branding differences.

Build as:

Configuration

---

## Category C

Different workflow.

Build as:

Plugin

---

## Category D

Completely different product.

Separate project.

---

# What We Never Do

❌ Duplicate repositories

❌ Duplicate CSS

❌ Hardcode restaurant names

❌ Hardcode logos

❌ Hardcode colors

❌ Hardcode features

❌ Create client branches

❌ Modify business logic for one customer

---

# What We Always Do

✅ Feature Flags

✅ Theme System

✅ Restaurant Settings

✅ Dynamic Branding

✅ Configuration Driven Design

✅ Shared Business Logic

---

# Release Strategy

```
Development

↓

Internal Testing

↓

Staging

↓

Production
```

Never deploy directly.

---

# Rollback Strategy

If deployment fails:

```
Rollback Previous Release

↓

Verify

↓

Restore

↓

Notify Team
```

---

# Monitoring

Production monitoring should include:

- Sentry
- Error Tracking
- Database Monitoring
- Slow Queries
- Performance Metrics
- Uptime Monitoring
- Health Checks

---

# Backup Strategy

Daily backups.

Point-in-time recovery.

Regular restore testing.

---

# Security Principles

Always enforce:

- Authentication
- Authorization
- Tenant Isolation
- RLS
- Input Validation
- Rate Limiting
- Audit Logs
- Secret Management

---

# Scaling Roadmap

## Phase 1

10 Restaurants

Single Region

---

## Phase 2

100 Restaurants

Performance Optimization

---

## Phase 3

500 Restaurants

Caching

Queues

Monitoring

---

## Phase 4

1000+ Restaurants

Read Replicas

Background Workers

CDN Optimization

Multi Region

---

# Engineering Principles

Before writing code always ask:

## Will this scale to 1000 restaurants?

---

## Can this be configurable?

---

## Can another restaurant use this feature?

---

## Does this reduce maintenance?

---

## Does this avoid duplicate code?

---

## Is there a simpler architecture?

---

## Is this secure?

---

## Does this improve production quality?

---

# Future Vision

The long-term goal is to evolve from a QR Ordering System into a complete Restaurant Operating System.

Future modules:

- Inventory
- Purchase Orders
- Suppliers
- Recipe Costing
- Loyalty
- CRM
- Reservations
- Mobile Apps
- POS
- Accounting
- Public API
- Webhooks
- Marketplace
- AI Analytics
- AI Staff Assistant

---

# Company Engineering Rules

Every developer working on this project must follow these rules:

1. Never duplicate code for a client.
2. Never fork the SaaS unless it becomes a different product.
3. Every feature should benefit multiple restaurants whenever possible.
4. Use configuration instead of code changes.
5. Build for future scale, not today's client.
6. Maintain one production codebase.
7. Think about maintainability before implementation.
8. Every architectural decision should reduce long-term maintenance.

---

# Related Documents

This document works together with:

- PROJECT_ARCHITECTURE.md
- DATABASE_ARCHITECTURE.md
- DEPENDENCY_GRAPH.md
- PRODUCTION_ROADMAP.md

Together these documents define:

- System Architecture
- Database
- Dependencies
- Production Roadmap
- SaaS Operations

These five documents are the complete engineering handbook for the Restaurant SaaS Platform.s