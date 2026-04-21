# Biblio-Teco

App personal de notas corporativas para consultarlo desde cualquier dispositivo.

## Estado Actual

- [x] Next.js + TypeScript + Tailwind
- [x] API routes para notas (/api/notes)
- [x] Deploy en Vercel: https://biblio-teco.vercel.app/
- [ ] Configurar Turso (SQLite cloud)
- [ ] Importar notas desde los .txt
- [ ] UI para agregar/editar notas

## Stack

- **Frontend:** Next.js 16, React, Tailwind
- **Backend:** Next.js API Routes
- **DB:** Turso SQLite (libSQL)
- **Deploy:** Vercel

## Archivos Importantes

- `src/lib/db.ts` - Cliente y queries de Turso
- `src/app/api/notes/route.ts` - Endpoints GET/POST notas
- `src/app/page.tsx` - UI principal de búsqueda

## Siguientes Pasos

1. Crear cuenta en https://turso.tech (gratis)
2. Obtener TURSO_AUTH_TOKEN y TURSO_DATABASE_URL
3. Agregar variables en Vercel Dashboard → Settings → Environment Variables
4. Importar notas de DAILY NOTES.txt y GENERAL NOTES.txt

## Notas Originales

- Located en carpeta del proyecto:
  - `DAILY NOTES.txt` (~9500 líneas)
  - `GENERAL NOTES.txt` (~227 líneas)