# Architecture Decisions

## ADR-001
Every customer session is stored separately from restaurant_tables.

Reason:
Tables represent physical tables.
Sessions represent customer visits.

---

## ADR-002
Every table visit has exactly one Order Group.

Reason:
Customers can place multiple orders during one visit.

---

## ADR-003
Orders never merge.

Every "Add More" action creates a new order inside the same Order Group.

---

## ADR-004
Table status is derived from session state.

Never derive table status from orders.

---

## ADR-005
Every important action is stored as an event.

Examples:
- Order Created
- Order Accepted
- Bill Requested
- Session Closed
- Payment Completed