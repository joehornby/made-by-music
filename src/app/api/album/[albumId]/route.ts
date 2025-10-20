import { NextResponse } from 'next/server';
import { mockCollectionData } from '@/app/store/mock-data';
import { Album } from '@/types/album';

interface RawAlbum {
  id: string;
  title: string;
  artist?: { name?: string };
  cover_xl?: string;
  cover_big?: string;
  cover_medium?: string;
  release_date?: string;
  duration?: number;
  nb_tracks?: number;
  genres?: { data?: { name?: string }[] };
  label?: string;
  fans?: number;
  explicit_lyrics?: boolean;
}

function transformAlbumData(rawAlbum: RawAlbum): Album {
  return {
    id: rawAlbum.id,
    title: rawAlbum.title,
    artistName: rawAlbum.artist?.name ?? "Unknown Artist",
    imageUrl:
      rawAlbum.cover_xl ?? rawAlbum.cover_big ?? rawAlbum.cover_medium ?? "",
    playUrl: `/album/${rawAlbum.id}`,
    releaseDate: rawAlbum.release_date ?? "",
    duration: rawAlbum.duration ?? 0,
    trackCount: rawAlbum.nb_tracks ?? 0,
    genre: rawAlbum.genres?.data?.[0]?.name || "Unknown",
    label: rawAlbum.label || "Unknown Label",
    fans: rawAlbum.fans ?? 0,
    explicitLyrics: rawAlbum.explicit_lyrics ?? false,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;

    // Find the album in mock data
    let foundAlbum = null;
    for (const collection of mockCollectionData) {
      const album = collection.albums.find((album) => album.id === albumId);
      if (album) {
        foundAlbum = album;
        break;
      }
    }

    if (!foundAlbum) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const transformedAlbum = transformAlbumData(foundAlbum);
    return NextResponse.json(transformedAlbum);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch album data" },
      { status: 500 }
    );
  }
}
