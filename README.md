# Fortnite Jam Tracker

Site que exibe as **músicas do Festival Fortnite** e as **Jam Tracks em rotação na loja diária**. Inclui busca no catálogo e sincronização do catálogo e atualização diária da rotação das músicas da loja/festival.

## Stack

- **Next.js 16** (App Router)
- **Prisma 7** + **PostgreSQL** (adapter `@prisma/adapter-pg`)
- **Tailwind CSS 4**
- **TypeScript**


## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx           # Página principal (daily + busca)
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── daily/         # GET daily + GET daily/sync
│       ├── tracks/        # GET busca
│       ├── sync/          # GET sync catálogo
│       └── cron/          # GET cron (catálogo + daily)
├── components/            # TrackCard, SearchBar, DailyTracksSection
├── types/                 # Track
└── lib/
    ├── db.ts              # PrismaClient com adapter pg
    ├── date.ts            # todayUTC()
    ├── fetchDailyTracks.ts # Scrape Fortnite.gg
    ├── fetchEpicTracks.ts  # Epic spark-tracks
    └── useDebounce.ts
prisma/
├── schema.prisma          # Track, DailyRotation
├── migrations/
└── ...
prisma.config.ts           # defineConfig (schema, datasource url)
vercel.json                # crons
```