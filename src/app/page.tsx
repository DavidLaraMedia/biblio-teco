"use client";

import { useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("general");

  const search = async () => {
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/notes?q=${encodeURIComponent(query)}`
        : "/api/notes";
      const res = await fetch(url);
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  const openForm = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormTitle(note.title);
      setFormContent(note.content);
      setFormCategory(note.category);
    } else {
      setEditingNote(null);
      setFormTitle("");
      setFormContent("");
      setFormCategory("general");
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("general");
  };

  const saveNote = async () => {
    if (!formTitle.trim() || !formContent.trim()) return;

    try {
      if (editingNote) {
        await fetch(`/api/notes?id=${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            category: formCategory,
          }),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            category: formCategory,
          }),
        });
      }
      closeForm();
      search();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNote = async (id: number) => {
    if (!confirm("¿Eliminar esta nota?")) return;
    try {
      await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      search();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <main className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-800">Biblioteca Teco</h1>
          <button
            onClick={() => openForm()}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700"
          >
            + Nueva Nota
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar en notas..."
            className="flex-1 p-3 rounded-lg border border-zinc-300 text-lg"
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        <div className="space-y-4">
          {notes.length === 0 && !loading && (
            <p className="text-zinc-500">No se encontraron notas</p>
          )}

          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                  {note.category}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(note.created_at).toLocaleDateString("es-AR")}
                </span>
                <button
                  onClick={() => openForm(note)}
                  className="text-xs text-blue-600 hover:underline ml-auto"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
              <h3 className="font-semibold text-zinc-800 mb-2">{note.title}</h3>
              <pre className="text-sm text-zinc-600 whitespace-pre-wrap font-mono bg-zinc-50 p-2 rounded overflow-x-auto">
                {note.content.slice(0, 500)}
                {note.content.length > 500 && "..."}
              </pre>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editingNote ? "Editar Nota" : "Nueva Nota"}
              </h2>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Título"
                className="w-full p-2 border border-zinc-300 rounded mb-3"
              />
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Contenido"
                rows={6}
                className="w-full p-2 border border-zinc-300 rounded mb-3 font-mono"
              />
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded mb-4"
              >
                <option value="general">General</option>
                <option value="daily">Daily</option>
                <option value="technique">Technique</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={closeForm}
                  className="px-4 py-2 border border-zinc-300 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}