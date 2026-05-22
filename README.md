# Made by Music

Made by Music is a Next.js music player demo. It presents album collections, charts, search results, playlist pages, album detail pages, and a persistent audio player with shared playback state.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Bun for dependency management
- Motion, React Spring, Three.js, and lucide-react for interaction and UI details

## Requirements

- Bun
- Node.js compatible with Next.js 15
- A music API server that matches the endpoints consumed by `src/lib/api.ts`

The frontend defaults to `http://localhost:3001/api` for API requests. Override that with `NEXT_PUBLIC_API_BASE_URL` when your API is hosted somewhere else.

## Getting Started

Install dependencies:

```bash
bun install
```

Create `.env.local` if your API is not running on the default URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
bun run dev
```

Runs the app locally with Turbopack.

```bash
bun run build
```

Builds the production app with Turbopack.

```bash
bun run start
```

Starts the production server after a build.

```bash
bun run lint
```

Runs ESLint.

## App Structure

- `src/app/page.tsx` renders the home page with the hero, charts, and collections.
- `src/app/album/[albumId]/page.tsx` renders album details and track lists.
- `src/app/album/[albumId]/play/page.tsx` renders the album playback view.
- `src/app/playlist/[playlistId]/page.tsx` renders playlist details.
- `src/app/search/page.tsx` renders query-driven search results.
- `src/app/library/page.tsx` renders the library view.
- `src/app/components/` contains the shared UI and player controls.
- `src/app/contexts/data-context.tsx` loads collections, albums, and playlists for client components.
- `src/app/contexts/playback-context.tsx` owns current track, queue, playback, seeking, and volume state.
- `src/lib/api.ts` contains the API client and shared API response types.
- `src/types/album.ts` keeps legacy component types used by older UI code.

## Data Contract

The frontend expects the API base URL to expose these resources:

- `GET /albums`
- `GET /albums/:id`
- `GET /albums/:id?expand=tracks`
- `GET /albums/:id/tracks`
- `GET /tracks`
- `GET /tracks/:id`
- `GET /collections`
- `GET /collections/:id`
- `GET /playlists`
- `GET /playlists/:id`
- `GET /playlists/:id?expand=tracks`
- `GET /playlists/:id/tracks`
- `GET /search?q=query`

Responses are expected to use the shapes defined in `src/lib/api.ts`, including paginated list responses as:

```ts
{
  data: T[];
  total: number;
}
```

Track playback uses `track.preview` when present. If no preview URL is available, the player falls back to `/api/audio/track-{trackId}.mp3`, so that path must be served if you rely on fallback audio.

## Development Notes

- The root layout wraps all pages in `DataProvider` and `PlaybackProvider`, then renders the sidebar, topbar, persistent player, and shared audio element.
- Album pages use `generateStaticParams()`, so production builds need the configured API to be reachable when static album paths are generated.
- API calls in `src/lib/api.ts` mix cached and uncached fetches. Album collections are treated as stable, while interactive resources such as search and playlists are fetched with `no-store`.
- Local fonts live in `src/app/fonts/` and are configured in `src/app/layout.tsx`.
- Mock Deezer-shaped data exists in `src/app/store/mock-data.ts` for older components and compatibility work, but the primary data path is the API client.

## Troubleshooting

- If pages render empty states or errors, confirm `NEXT_PUBLIC_API_BASE_URL` points to a running API server.
- If `bun run build` fails while generating album pages, check that `GET /albums` and `GET /albums/:id?expand=tracks` are available during the build.
- If images do not load, confirm the remote image host is allowed in `next.config.ts`. The current configuration allows `made-by-music-api.vercel.app`, `localhost:3845`, and `localhost:3001`.
- If playback controls move but no audio plays, inspect the track payload and verify either `preview` is populated or `/api/audio/track-{trackId}.mp3` is served.
