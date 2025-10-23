import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/app/components/page-container";
import {
  getAlbumWithTracks,
  getAlbums,
  type AlbumWithTracks,
  type Track,
} from "@/lib/api";

interface AlbumPageProps {
  params: Promise<{ albumId: string }>;
}

export async function generateStaticParams() {
  try {
    const albums = await getAlbums();
    return albums.data.map((album) => ({
      albumId: album.id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumId } = await params;

  try {
    const albumData = await getAlbumWithTracks(parseInt(albumId));
    return (
      <AlbumPageContent album={albumData} tracks={albumData.tracks.data} />
    );
  } catch {
    notFound();
  }
}

function AlbumPageContent({
  album,
  tracks,
}: {
  album: AlbumWithTracks;
  tracks: Track[];
}) {
  return (
    <PageContainer backButtonHref="/" backButtonText="Back to Home">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8">
        <div className="relative w-48 h-48 md:w-64 md:h-64 super-rounded-lg overflow-hidden">
          <Image
            src={album.cover_xl}
            alt={album.title}
            fill
            className="object-cover"
            priority
            sizes="256px"
          />
        </div>
        <div className="flex-1 text-center md:text-left w-full">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 break-words">
            {album.title}
          </h1>
          <p className="text-lg md:text-2xl text-light/70 mb-4 break-words">
            {album.artist.name}
          </p>
          <div className="flex justify-center md:justify-start gap-4 md:gap-6 text-sm text-light/60 mb-6 flex-wrap">
            <span>{album.release_date}</span>
            <span>{tracks.length} tracks</span>
          </div>
          <Link
            href={`/album/${album.id}/play`}
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent/80 text-dark px-6 py-3 rounded-full font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
            </svg>
            Play Album
          </Link>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-dark-alt super-rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
          Tracks
        </h2>
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-2 md:gap-4 p-2 md:p-3 super-rounded-lg hover:bg-light/5 transition-colors"
            >
              <span className="text-light/40 w-6 md:w-8 text-center text-sm md:text-base">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm md:text-base truncate">
                  {track.title}
                </p>
                <p className="text-xs md:text-sm text-light/60 truncate">
                  {track.artist.name}
                </p>
              </div>
              <span className="text-light/40 text-xs md:text-sm flex-shrink-0">
                {Math.floor(track.duration / 60)}:
                {(track.duration % 60).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
