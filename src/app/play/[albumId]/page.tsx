import Image from 'next/image';
import { Album } from '@/types/album';

interface PlayPageProps {
  params: { albumId: string };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { albumId } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/play/${albumId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch album');
    }
    
    const album: Album = await response.json();
    
    return (
      <div className="fixed inset-0 w-full h-full">
        <div className="relative w-full h-full">
          <Image
            src={album.imageUrl}
            alt={album.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
            <p className="text-xl mb-4">{album.artistName}</p>
            <div className="flex gap-4 text-sm opacity-80">
              <span>{album.releaseDate}</span>
              <span>{album.trackCount} tracks</span>
              <span>{album.genre}</span>
              {album.explicitLyrics && <span>Explicit</span>}
            </div>
          </div>
        </div>
      </div>
    );
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
