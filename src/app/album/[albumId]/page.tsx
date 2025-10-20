import Image from 'next/image';
import { Album, Track } from '@/types/album';
import Link from 'next/link';

interface AlbumPageProps {
  params: Promise<{ albumId: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumId } = await params;
  
  try {
    const [albumResponse, tracksResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/album/${albumId}`, {
        cache: 'no-store'
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tracks/${albumId}`, {
        cache: 'no-store'
      })
    ]);
    
    if (!albumResponse.ok || !tracksResponse.ok) {
      throw new Error('Failed to fetch album or tracks');
    }
    
    const album: Album = await albumResponse.json();
    const tracks: Track[] = await tracksResponse.json();
    
    return <AlbumPageContent album={album} tracks={tracks} />;
  } catch {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
          <p className="text-gray-600">We can&apos;t find the album you&apos;re looking for.</p>
        </div>
      </div>
    );
  }
}

function AlbumPageContent({ album, tracks }: { album: Album; tracks: Track[] }) {
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end gap-8 mb-8">
          <div className="relative w-64 h-64 super-rounded-lg overflow-hidden">
            <Image
              src={album.imageUrl}
              alt={album.title}
              fill
              className="object-cover"
              priority
              sizes="256px"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
            <p className="text-2xl text-light/70 mb-4">{album.artistName}</p>
            <div className="flex gap-6 text-sm text-light/60 mb-6">
              <span>{album.releaseDate}</span>
              <span>{album.trackCount} tracks</span>
              <span>{album.genre}</span>
              {album.explicitLyrics && <span>Explicit</span>}
            </div>
            <Link
              href={`/album/${album.id}/play`}
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent/80 text-dark px-6 py-3 rounded-full font-medium transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z"/>
              </svg>
              Play Album
            </Link>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-dark-alt super-rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 super-rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-light/40 w-8 text-center">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-light/60">{track.artistName}</p>
                </div>
                <span className="text-light/40 text-sm">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}