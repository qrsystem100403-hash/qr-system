# Foreign Key Hardening Plan

## Guiding Principle

> **Business data is archived, not deleted.**

---

## Keep As-Is

| Relationship | FK Action |
|--------------|-----------|
| `restaurants → restaurant_features` | **CASCADE** |
| `restaurants → restaurant_billing_settings` | **CASCADE** |
| `menu_items → menu_item_variants` | **CASCADE** |
| `menu_items → menu_item_addons` | **CASCADE** |
| `menu_categories → menu_items` | **SET NULL** |
| `order_items → order_item_addons` | **CASCADE** |
| `menu_item_variants → order_items` | **SET NULL** |
| `menu_item_addons → order_item_addons` | **SET NULL** |
| `restaurants → orders` | **NO ACTION** |

---

## Required Changes

| Relationship | Current | New |
|--------------|---------|-----|
| `orders → order_items` | **NO ACTION** | **CASCADE** |
| `requests → table_sessions` | **CASCADE** | **SET NULL** |
| `restaurants → restaurant_users` | **CASCADE** | **RESTRICT** |
| `restaurants → attendance_logs` | **CASCADE** | **RESTRICT** |
| `restaurants → table_sessions` | **CASCADE** | **RESTRICT** |

---

# Restaurant Lifecycle

```text
┌──────────┐
│  Active  │
└────┬─────┘
     │
     ▼
┌────────────┐
│ Suspended  │
└────┬───────┘
     │
     ▼
┌──────────┐
│ Archived │
└────┬─────┘
     │
     ▼
┌──────────────┐
│ Soft Deleted │
└────┬─────────┘
     │
     ▼
┌────────────────────────────┐
│ Hard Delete (Super Admin)  │
└────────────────────────────┘
```

## Lifecycle Columns

| Column | Purpose |
|--------|---------|
| `is_active` | Indicates whether the restaurant is active |
| `suspended_at` | Timestamp when suspended |
| `archived_at` | Timestamp when archived |
| `deleted_at` | Soft delete timestamp |

---

# Migration Order

1. Add lifecycle columns.
2. Disable physical restaurant deletion.
3. Update foreign key rules.
4. Test rollback.
5. Verify RLS.
6. Deploy.

---

# Status

> ✅ **Approved**