import { getPlaylistWithTracks } from "@/lib/api";
import PlaylistPageClient from "./playlist-page-client";

interface PlaylistPageProps {
  params: Promise<{ playlistId: string }>;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { playlistId } = await params;

  try {
    const playlistData = await getPlaylistWithTracks(playlistId);
    return <PlaylistPageClient playlist={playlistData} />;
  } catch {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Playlist Not Found</h1>
          <p className="text-gray-600">
            We can&apos;t find the playlist you&apos;re looking for.
          </p>
        </div>
      </div>
    );
  }
}
