import { NextResponse } from 'next/server';
import { getTracksForAlbum } from '@/app/store/mock-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await params;
    
    const tracks = getTracksForAlbum(albumId);
    
    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found for this album' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
