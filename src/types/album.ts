export interface Album {
  id: string;
  title: string;
  artistName: string;
  imageUrl: string;
  playUrl: string;
  releaseDate: string;
  duration: number;
  trackCount: number;
  genre: string;
  label: string;
  fans: number;
  explicitLyrics: boolean;
}

export interface AlbumCardProps {
  className?: string;
  imageUrl: string;
  albumTitle: string;
  artistName: string;
  albumId?: string;
  playUrl?: string;
}

export interface Collection {
  name: string;
  albums: Album[];
}

export interface Track {
  id: string;
  title: string;
  artistName: string;
  albumTitle: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  albumId: string;
}
