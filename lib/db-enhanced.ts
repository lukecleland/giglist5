import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Enhanced query function with parameterized queries
export async function query(sql: string, values?: any[]) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}

// Safe parameter escaping for when you need to build dynamic queries
export function escapeParam(value: any): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "string") {
    return pool.escape(value);
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  if (value instanceof Date) {
    return pool.escape(value.toISOString().slice(0, 19).replace("T", " "));
  }
  return pool.escape(String(value));
}

// Utility to build WHERE clauses safely
export function buildWhereClause(conditions: Record<string, any>): {
  sql: string;
  values: any[];
} {
  const clauses: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(conditions)) {
    if (value !== undefined && value !== null) {
      clauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  return {
    sql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}
