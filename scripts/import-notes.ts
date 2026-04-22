import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

interface Note {
  title: string;
  content: string;
  category: string;
}

function parseNotesFile(content: string, category: string): Note[] {
  const notes: Note[] = [];
  const lines = content.split("\n");

  let currentTitle = "";
  let currentContentLines: string[] = [];
  let inNote = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.match(/^-+$/) || trimmed.match(/^-{20,}/)) {
      if (currentTitle && currentContentLines.length > 0) {
        notes.push({
          title: currentTitle.replace(/^-\s*|-+$/g, "").trim(),
          content: currentContentLines.join("\n").trim(),
          category,
        });
      }
      currentTitle = "";
      currentContentLines = [];
      inNote = false;
    } else if (!inNote && trimmed) {
      currentTitle = trimmed;
      inNote = true;
    } else if (inNote && trimmed) {
      currentContentLines.push(line);
    }
  }

  if (currentTitle && currentContentLines.length > 0) {
    notes.push({
      title: currentTitle.replace(/^-\s*|-+$/g, "").trim(),
      content: currentContentLines.join("\n").trim(),
      category,
    });
  }

  return notes;
}

async function importNotes() {
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

  const dailyNotesPath = path.join(process.cwd(), "DAILY NOTES.txt");
  const generalNotesPath = path.join(process.cwd(), "GENERAL NOTES.txt");

  if (fs.existsSync(dailyNotesPath)) {
    const content = fs.readFileSync(dailyNotesPath, "utf-8");
    const notes = parseNotesFile(content, "daily");
    console.log(`Importando ${notes.length} notas de DAILY NOTES.txt...`);

    for (const note of notes) {
      await client.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [note.title, note.content, note.category],
      });
    }
  }

  if (fs.existsSync(generalNotesPath)) {
    const content = fs.readFileSync(generalNotesPath, "utf-8");
    const notes = parseNotesFile(content, "general");
    console.log(`Importando ${notes.length} notas de GENERAL NOTES.txt...`);

    for (const note of notes) {
      await client.execute({
        sql: "INSERT INTO notes (title, content, category) VALUES (?, ?, ?)",
        args: [note.title, note.content, note.category],
      });
    }
  }

  const result = await client.execute("SELECT COUNT(*) as count FROM notes");
  console.log(`Total de notas en la base de datos: ${result.rows[0].count}`);
}

importNotes()
  .then(() => console.log("Importación completada"))
  .catch((e) => console.error("Error:", e.message));