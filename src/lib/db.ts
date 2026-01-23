// ============================================
// SMART LINK HUB - Database Connection
// ============================================

import { Pool, QueryResultRow } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Execute a SQL query.
 */
export async function query<T extends QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
) {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text: text.substring(0, 50), duration, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single row by query.
 */
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

/**
 * Get multiple rows by query.
 */
export async function queryMany<T extends QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}

/**
 * Execute an INSERT and return the inserted row.
 */
export async function insertOne<T extends QueryResultRow>(
  text: string,
  params?: (string | number | boolean | null)[]
): Promise<T> {
  const result = await query<T>(text, params);
  return result.rows[0];
}

/**
 * Health check for database connection.
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

export default pool;
