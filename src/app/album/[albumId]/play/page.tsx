import Image from "next/image";
import Link from "next/link";
import AlbumPlayerClient from "./album-player-client";
import { getAlbumWithTracks, type AlbumWithTracks } from "@/lib/api";

interface AlbumPlayerProps {
  params: Promise<{ albumId: string }>;
}

export default async function AlbumPlayer({ params }: AlbumPlayerProps) {
  const { albumId } = await params;

  try {
    const albumData = await getAlbumWithTracks(parseInt(albumId));

    return (
      <>
        <AlbumPlayerClient album={albumData} tracks={albumData.tracks.data} />
        <AlbumPlayerContent album={albumData} />
      </>
    );
  } catch {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
          <p className="text-gray-600">
            We can&apos;t find the album you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }
}

function AlbumPlayerContent({ album }: { album: AlbumWithTracks }) {
  return (
    <div className="fixed inset-0 w-full h-full">
      <div className="relative w-full h-full">
        <Image
          src={album.cover_xl}
          alt={album.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Back button */}
        <div className="absolute top-32 left-32 z-10">
          <Link
            href={`/album/${album.id}`}
            className="flex items-center gap-3 text-white hover:text-white/80 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 0 1 1.414 1.414L5.414 9H17a1 1 0 1 1 0 2H5.414l4.293 4.293a1 1 0 0 1 0 1.414Z"
                clipRule="evenodd"
              />
            </svg>
            Back to Album
          </Link>
        </div>

        {/* Album info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
          <p className="text-xl mb-4">{album.artist.name}</p>
          <div className="flex gap-4 text-sm opacity-80">
            <span>{album.release_date}</span>
            <span>{album.tracks.data.length} tracks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
