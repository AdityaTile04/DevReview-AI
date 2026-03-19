import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Supabase (and many hosted Postgres providers) require SSL.
// The pg driver needs an explicit ssl config; `ssl: false` will fail.
const ssl =
  connectionString && connectionString.includes("supabase.com")
    ? { rejectUnauthorized: false }
    : undefined;

const pool = new Pool({
  connectionString,
  ssl,
});

export default pool;
