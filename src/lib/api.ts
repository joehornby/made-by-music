// API Types based on the specification
export interface Artist {
  id: number;
  name: string;
  type: "artist";
}

export interface Album {
  id: number;
  title: string;
  artist: Artist;
  cover: string;
  cover_xl: string;
  release_date: string;
  type: "album";
}

export interface Track {
  id: number;
  title: string;
  duration: number; // in seconds
  preview: string; // path to audio file
  artist: Artist;
  album: Album;
}

export interface Collection {
  id: string;
  title: string;
  type: "collection";
  albums: Album[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface ErrorResponse {
  error: string;
}

export interface AlbumWithTracks extends Album {
  tracks: PaginatedResponse<Track>;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// API Helper Functions
export async function getAlbums(): Promise<PaginatedResponse<Album>> {
  const response = await fetch(`${API_BASE_URL}/albums`, { cache: "no-store" });
  return handleResponse<PaginatedResponse<Album>>(response);
}

export async function getAlbum(id: number): Promise<Album> {
  const response = await fetch(`${API_BASE_URL}/albums/${id}`, { cache: "no-store" });
  return handleResponse<Album>(response);
}

export async function getAlbumWithTracks(id: number): Promise<AlbumWithTracks> {
  const response = await fetch(`${API_BASE_URL}/albums/${id}?expand=tracks`, { cache: "no-store" });
  return handleResponse<AlbumWithTracks>(response);
}

export async function getTracksForAlbum(id: number): Promise<PaginatedResponse<Track>> {
  const response = await fetch(`${API_BASE_URL}/albums/${id}/tracks`, { cache: "no-store" });
  return handleResponse<PaginatedResponse<Track>>(response);
}

export async function getTracks(): Promise<PaginatedResponse<Track>> {
  const response = await fetch(`${API_BASE_URL}/tracks`, { cache: "no-store" });
  return handleResponse<PaginatedResponse<Track>>(response);
}

export async function getTrack(id: number): Promise<Track> {
  const response = await fetch(`${API_BASE_URL}/tracks/${id}`, { cache: "no-store" });
  return handleResponse<Track>(response);
}

export async function getCollections(): Promise<PaginatedResponse<Collection>> {
  const response = await fetch(`${API_BASE_URL}/collections`, { cache: "no-store" });
  return handleResponse<PaginatedResponse<Collection>>(response);
}

export async function getCollection(id: string): Promise<Collection> {
  const response = await fetch(`${API_BASE_URL}/collections/${id}`, { cache: "no-store" });
  return handleResponse<Collection>(response);
}

export async function search(query: string): Promise<PaginatedResponse<Album | Track>> {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
  return handleResponse<PaginatedResponse<Album | Track>>(response);
}

export function getStreamUrl(trackId: number): string {
  return `${API_BASE_URL}/stream/${trackId}`;
}
