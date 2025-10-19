import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching Deezer playlist data...');
    
    const response = await fetch('https://api.deezer.com/playlist/7241549564');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Deezer API Response:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Deezer API test successful',
      data: data
    });
    
  } catch (error) {
    console.error('Error fetching Deezer data:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch Deezer data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
