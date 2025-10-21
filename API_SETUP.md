# API Configuration

This app now uses an external API instead of internal Next.js API routes.

## Environment Variables

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

For production, replace with your production API URL:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

## API Endpoints Used

The app expects the following API endpoints to be available:

- `GET /albums` - List all albums (returns PaginatedResponse<Album>)
- `GET /albums/{id}` - Get album details (returns Album)
- `GET /albums/{id}?expand=tracks` - Get album with tracks (returns AlbumWithTracks)
- `GET /albums/{id}/tracks` - Get tracks for an album (returns PaginatedResponse<Track>)
- `GET /tracks` - List all tracks (returns PaginatedResponse<Track>)
- `GET /tracks/{id}` - Get track details (returns Track)
- `GET /collections` - List collections (returns PaginatedResponse<Collection>)
- `GET /collections/{id}` - Get collection details (returns Collection)
- `GET /search?q={query}` - Search albums and tracks (returns PaginatedResponse<Album | Track>)
- `GET /stream/{track_id}` - Stream audio (binary data)

## Running the App

1. Start your API server on port 3001 (or configure the environment variable)
2. Run the Next.js app: `npm run dev`
3. The app will connect to your API automatically

## API Types

The app uses TypeScript types that match the API specification:
- `Album`, `Track`, `Artist`, `Collection`
- `PaginatedResponse<T>` for paginated endpoints
- `AlbumWithTracks` for albums with embedded tracks

## Image URLs

The API should return full URLs for image fields:
```json
{
  "cover": "http://localhost:3001/covers/616582051.jpg",
  "cover_xl": "http://localhost:3001/covers/616582051.jpg"
}
```

This ensures Next.js Image components can properly load and optimize the images.