import { NextResponse } from 'next/server';
import { mockCollectionData } from '@/app/store/mock-data';
import { Album } from '@/types/album';

function transformAlbumData(rawAlbum: any): Album {
  return {
    id: rawAlbum.id,
    title: rawAlbum.title,
    artistName: rawAlbum.artist?.name || 'Unknown Artist',
    imageUrl: rawAlbum.cover_xl || rawAlbum.cover_big || rawAlbum.cover_medium,
    playUrl: `/play/${rawAlbum.id}`,
    releaseDate: rawAlbum.release_date,
    duration: rawAlbum.duration,
    trackCount: rawAlbum.nb_tracks,
    genre: rawAlbum.genres?.data?.[0]?.name || 'Unknown',
    label: rawAlbum.label || 'Unknown Label',
    fans: rawAlbum.fans || 0,
    explicitLyrics: rawAlbum.explicit_lyrics || false,
  };
}

export async function GET() {
  try {
    const collections = mockCollectionData.map(collection => ({
      name: collection.name,
      albums: collection.albums.map(transformAlbumData)
    }));
    
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collection data' },
      { status: 500 }
    );
  }
}
