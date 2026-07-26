BEGIN;

----------------------------------------------------------
-- 1. Session Status
----------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'table_session_status'
    ) THEN
        CREATE TYPE table_session_status AS ENUM (
            'active',
            'bill_requested',
            'completed',
            'expired'
        );
    END IF;
END
$$;

----------------------------------------------------------
-- 2. table_sessions
----------------------------------------------------------

CREATE TABLE IF NOT EXISTS table_sessions (

    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    restaurant_id uuid NOT NULL
        REFERENCES restaurants(id)
        ON DELETE CASCADE,

    table_id uuid NOT NULL
        REFERENCES restaurant_tables(id)
        ON DELETE CASCADE,

    session_token text NOT NULL UNIQUE,

    status table_session_status
        NOT NULL DEFAULT 'active',

    started_at timestamptz
        NOT NULL DEFAULT now(),

    expires_at timestamptz
        NOT NULL,

    bill_requested_at timestamptz,

    completed_at timestamptz,

    created_at timestamptz
        NOT NULL DEFAULT now(),

    updated_at timestamptz
        NOT NULL DEFAULT now()
);

----------------------------------------------------------
-- 3. Indexes
----------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_table_sessions_restaurant
ON table_sessions(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_table_sessions_table
ON table_sessions(table_id);

CREATE INDEX IF NOT EXISTS idx_table_sessions_status
ON table_sessions(status);

CREATE INDEX IF NOT EXISTS idx_table_sessions_expires
ON table_sessions(expires_at);

----------------------------------------------------------
-- 4. One active session per table
----------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS
idx_table_active_session
ON table_sessions(table_id)
WHERE status IN ('active','bill_requested');

----------------------------------------------------------
-- 5. Migrate Existing Sessions
----------------------------------------------------------

INSERT INTO table_sessions (

    restaurant_id,
    table_id,
    session_token,
    status,
    started_at,
    expires_at,
    bill_requested_at

)

SELECT

    restaurant_id,

    id,

    current_session_token,

    CASE
        WHEN bill_requested_at IS NULL
            THEN 'active'
        ELSE 'bill_requested'
    END,

    COALESCE(session_started_at, now()),

    session_expires_at,

    bill_requested_at

FROM restaurant_tables

WHERE current_session_token IS NOT NULL;

----------------------------------------------------------
-- 6. Cleanup old columns
----------------------------------------------------------

ALTER TABLE restaurant_tables
DROP COLUMN IF EXISTS current_session_token;

ALTER TABLE restaurant_tables
DROP COLUMN IF EXISTS session_started_at;

ALTER TABLE restaurant_tables
DROP COLUMN IF EXISTS session_expires_at;

COMMIT;