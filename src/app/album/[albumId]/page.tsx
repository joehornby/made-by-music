import AlbumPageClient from "./album-page-client";

interface AlbumPageProps {
  params: Promise<{ albumId: string }>;
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumId } = await params;

  return <AlbumPageClient albumId={albumId} />;
}
