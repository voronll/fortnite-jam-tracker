# Estrutura de diretórios – Fortnite Jam Tracker

```
fortnite-jam-tracker/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20260224134503_init/
│       │   └── migration.sql
│       └── 20260224160549_add_track_sid/
│           └── migration.sql
├── scripts/
│   └── auth.mjs
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── daily/
│   │       │   ├── daily.ts
│   │       │   └── sync/
│   │       │       └── route.ts
│   │       ├── debug/
│   │       │   └── track-ids/
│   │       │       └── route.ts
│   │       ├── sync/
│   │       │   └── route.ts
│   │       └── tracks/
│   │           └── route.ts
│   └── lib/
│       ├── db.ts
│       ├── date.ts
│       ├── fetchDailyTracks.ts
│       ├── fetchEpicTracks.ts
│       └── useDebounce.ts
├── generated/          # Prisma Client (gerado)
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── .gitignore
```

## Resumo

| Pasta / arquivo | Descrição |
|-----------------|-----------|
| **prisma/** | Schema e migrações do banco (SQLite). |
| **scripts/** | Scripts auxiliares (ex.: autenticação `auth.mjs`). |
| **src/app/** | App Router do Next.js: páginas, layout e rotas de API. |
| **src/app/api/** | Rotas de API: `daily/sync`, `debug/track-ids`, `sync`, `tracks`. |
| **src/lib/** | Utilitários: DB, datas, fetch (Fortnite.gg, Epic), hooks. |
| **generated/** | Saída do Prisma Client (não versionado no exemplo). |
