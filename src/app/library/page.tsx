import CollectionGrid from "@/app/components/collection-grid";
import BackButton from "@/app/components/back-button";
import {
  getPlaylists,
  getPlaylistWithTracks,
  type PlaylistWithTracks,
} from "@/lib/api";

export default async function Library() {
  // Fetch playlists and their track data on the server
  const playlistsResponse = await getPlaylists();
  const enrichedPlaylists = await Promise.all(
    playlistsResponse.data.map(async (playlist) => {
      try {
        const playlistWithTracks = await getPlaylistWithTracks(playlist.id);
        return {
          ...playlist,
          tracks: playlistWithTracks.tracks,
        };
      } catch (error) {
        console.error(
          `Error fetching tracks for playlist ${playlist.id}:`,
          error
        );
        return {
          ...playlist,
          tracks: { data: [], total: 0 },
        };
      }
    })
  );

  return (
    <main className="grid grid-cols-4 md:grid-cols-12 gap-16">
      <div className="col-span-full">
        <BackButton href="/" text="Back to Home" />
      </div>
      <CollectionGrid
        className="col-span-full"
        enrichedPlaylists={enrichedPlaylists}
      />
    </main>
  );
}
