# Biblio-Teco

App personal de notas corporativas para consultarlo desde cualquier dispositivo.

## Estado Actual

- [x] Next.js + TypeScript + Tailwind
- [x] API routes para notas (/api/notes)
- [x] Deploy en Vercel: https://biblio-teco.vercel.app/
- [x] Configurar Turso (SQLite cloud)
- [x] Importar notas desde los .txt (167 notas)
- [x] UI para buscar notas
- [ ] UI para agregar/editar/borrar notas (funcional pero básica)
- [ ] Agregar tags/categorías a las notas
- [ ] Limpiar Notas (borrarNotas obsoletas)
- [ ] Mejorar UI (markdown, búsqueda mejorada, filtros)

## Stack

- **Frontend:** Next.js 16, React, Tailwind
- **Backend:** Next.js API Routes
- **DB:** Turso SQLite (libSQL)
- **Deploy:** Vercel

## Turso DB

- URL: `libsql://biblio-teco-davidlaramedia.aws-us-east-1.turso.io`
- Tabla: `notes` con campos `id, title, content, category, created_at, updated_at`

## Archivos Importantes

- `src/lib/db.ts` - Cliente y queries de Turso
- `src/app/api/notes/route.ts` - Endpoints GET/POST/PUT/DELETE notas
- `src/app/page.tsx` - UI principal
- `scripts/import-notes.ts` - Script para importar notas
- `scripts/check-notes.ts` - Script para verificar notas

## Notas Originales

- Located en carpeta del proyecto:
  - `DAILY NOTES.txt` (~9500 líneas)
  - `GENERAL NOTES.txt` (~227 líneas)