# Decision #DB-001

restaurant_users will support many-to-many relationships between users and restaurants. The correct uniqueness rule is UNIQUE (restaurant_id, user_id). Single-column unique constraints on restaurant_id or user_id are not compatible with a scalable SaaS.