# Sessions Module

Responsible for:

- QR sessions
- Session lifecycle
- Session expiry
- Session recovery
- Bill requested state
- Auto release
- Session validation
- Session cookies

This module owns all session-related business logic.

No other module should manipulate session state directly.