-- Database initialization script
-- This runs automatically when the PostgreSQL container starts for the first time

-- Create extension for UUID generation (if needed in future)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON DATABASE chaykov_saas TO postgres;

-- The actual tables will be created by Drizzle ORM migrations
-- This script is mainly for any initial setup or extensions
