import { Database } from "bun:sqlite";

const db = new Database("fcm_tokens.db");

db.run(`
  CREATE TABLE IF NOT EXISTS fcm_tokens (
    address TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export async function storeFCMToken(
  address: string,
  token: string,
): Promise<void> {
  const query = `
    INSERT INTO fcm_tokens (address, token, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(address)
    DO UPDATE SET
      token = excluded.token,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(query, [address, token]);
}

export async function getFCMToken(address: string): Promise<string | null> {
  const result = db
    .prepare("SELECT token FROM fcm_tokens WHERE address = ?")
    .get(address) as { token: string } | null;
  return result ? result.token : null;
}
