"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ViewTransitionLink from "@/app/components/view-transition-link";
import PageContainer from "@/app/components/page-container";
import {
  getAlbumWithTracks,
  type AlbumWithTracks,
  type Track,
} from "@/lib/api";

interface AlbumPageClientProps {
  albumId: string;
}

export default function AlbumPageClient({ albumId }: AlbumPageClientProps) {
  const [albumData, setAlbumData] = useState<AlbumWithTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlbumWithTracks(parseInt(albumId));
        setAlbumData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albumId]);

  if (loading) {
    return <AlbumPageSkeleton />;
  }

  if (error || !albumData) {
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

  return <AlbumPageContent album={albumData} tracks={albumData.tracks.data} />;
}

function AlbumPageSkeleton() {
  return (
    <PageContainer backButtonHref="/" backButtonText="Back to Home">
      {/* Header Skeleton */}
      <div className="flex items-end gap-8 mb-8">
        <div className="relative w-64 h-64 super-rounded-lg overflow-hidden album-cover-transition">
          <div className="w-full h-full bg-dark-alt animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="h-12 bg-dark-alt rounded-lg mb-4 animate-pulse" />
          <div className="h-8 bg-dark-alt rounded-lg mb-4 animate-pulse w-2/3" />
          <div className="flex gap-6 mb-6">
            <div className="h-4 bg-dark-alt rounded animate-pulse w-20" />
            <div className="h-4 bg-dark-alt rounded animate-pulse w-16" />
            <div className="h-4 bg-dark-alt rounded animate-pulse w-24" />
          </div>
          <div className="h-12 bg-accent rounded-full w-32 animate-pulse" />
        </div>
      </div>

      {/* Track List Skeleton */}
      <div className="bg-dark-alt super-rounded-lg p-6">
        <div className="h-6 bg-dark-alt rounded-lg mb-6 w-24 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 super-rounded-lg"
            >
              <div className="w-8 h-4 bg-dark-alt rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-dark-alt rounded mb-2 animate-pulse" />
                <div className="h-3 bg-dark-alt rounded w-2/3 animate-pulse" />
              </div>
              <div className="w-12 h-3 bg-dark-alt rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
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
      <div className="flex items-end gap-8 mb-8">
        <div className="relative w-64 h-64 super-rounded-lg overflow-hidden album-cover-transition">
          <Image
            src={album.cover_xl}
            alt={album.title}
            fill
            className="object-cover"
            priority
            sizes="256px"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-4">{album.title}</h1>
          <p className="text-2xl text-light/70 mb-4">{album.artist.name}</p>
          <div className="flex gap-6 text-sm text-light/60 mb-6">
            <span>{album.release_date}</span>
            <span>{tracks.length} tracks</span>
          </div>
          <ViewTransitionLink
            href={`/album/${album.id}/play`}
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent/80 text-dark px-6 py-3 rounded-full font-medium transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
            </svg>
            Play Album
          </ViewTransitionLink>
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
              <span className="text-light/40 w-8 text-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-light/60">{track.artist.name}</p>
              </div>
              <span className="text-light/40 text-sm">
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