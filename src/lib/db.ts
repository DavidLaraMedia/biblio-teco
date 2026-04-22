import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_notes_content ON notes(content)
  `);
}

export async function searchNotes(query: string) {
  const result = await client.execute({
    sql: `SELECT * FROM notes WHERE content LIKE ? OR title LIKE ? LIMIT 50`,
    args: [`%${query}%`, `%${query}%`],
  });
  return result.rows;
}

export async function getAllNotes() {
  const result = await client.execute({
    sql: `SELECT * FROM notes ORDER BY updated_at DESC LIMIT 100`,
  });
  return result.rows;
}

export async function addNote(title: string, content: string, category: string = "general") {
  const result = await client.execute({
    sql: `INSERT INTO notes (title, content, category) VALUES (?, ?, ?)`,
    args: [title, content, category],
  });
  return result;
}

export async function updateNote(id: number, title: string, content: string, category: string) {
  const result = await client.execute({
    sql: `UPDATE notes SET title = ?, content = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [title, content, category, id],
  });
  return result;
}

export async function deleteNote(id: number) {
  const result = await client.execute({
    sql: `DELETE FROM notes WHERE id = ?`,
    args: [id],
  });
  return result;
}