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
  genres?: {
    data?: { name?: string }[];
  };
  label?: string;
  fans?: number;
  explicit_lyrics?: boolean;
}

function transformAlbumData(rawAlbum: RawAlbum): Album {
  return {
    id: rawAlbum.id,
    title: rawAlbum.title,
    artistName: rawAlbum.artist?.name || "Unknown Artist",
    imageUrl:
      rawAlbum.cover_xl || rawAlbum.cover_big || rawAlbum.cover_medium || "",
    playUrl: `/album/${rawAlbum.id}`,
    releaseDate: rawAlbum.release_date || "",
    duration: rawAlbum.duration ?? 0,
    trackCount: rawAlbum.nb_tracks ?? 0,
    genre: rawAlbum.genres?.data?.[0]?.name || "Unknown",
    label: rawAlbum.label || "Unknown Label",
    fans: rawAlbum.fans || 0,
    explicitLyrics: rawAlbum.explicit_lyrics || false,
  };
}

export async function GET() {
  try {
    const collections = mockCollectionData.map((collection) => ({
      name: collection.name,
      albums: collection.albums.map(transformAlbumData),
    }));

    return NextResponse.json(collections);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
