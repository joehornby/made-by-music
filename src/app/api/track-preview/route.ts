import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');
    
    if (!trackId) {
      return NextResponse.json(
        { error: 'Track ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching fresh preview URL for track:', trackId);

    // Fetch track details from Deezer API
    const response = await fetch(`https://api.deezer.com/track/${trackId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trackData = await response.json();

    if (!trackData.preview) {
      throw new Error('No preview available for this track');
    }

    return NextResponse.json({
      success: true,
      track: {
        id: trackData.id,
        title: trackData.title,
        artistName: trackData.artist?.name || 'Unknown Artist',
        albumTitle: trackData.album?.title || 'Unknown Album',
        duration: parseInt(trackData.duration) || 30,
        audioUrl: trackData.preview,
        imageUrl: trackData.album?.cover_big || trackData.album?.cover_medium || '',
        albumId: trackData.album?.id || trackData.id,
      }
    });

  } catch (error) {
    console.error('Error fetching fresh track preview:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch fresh track preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
