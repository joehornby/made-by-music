import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching fresh Deezer track data...');
    
    const response = await fetch('https://api.deezer.com/playlist/7241549564');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get the first track with preview URL
    const firstTrack = data.tracks?.data?.[0];
    
    if (!firstTrack || !firstTrack.preview) {
      throw new Error('No track with preview found');
    }
    
    // Return just the track data we need
    return NextResponse.json({
      success: true,
      track: {
        id: firstTrack.id,
        title: firstTrack.title,
        artistName: firstTrack.artist?.name || 'Unknown Artist',
        albumTitle: firstTrack.album?.title || 'Unknown Album',
        duration: parseInt(firstTrack.duration) || 30,
        audioUrl: firstTrack.preview,
        imageUrl: firstTrack.album?.cover_big || firstTrack.album?.cover_medium || '',
        albumId: firstTrack.album?.id || firstTrack.id,
      }
    });
    
  } catch (error) {
    console.error('Error fetching Deezer track:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch track data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
