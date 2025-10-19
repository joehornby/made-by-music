import Collection from "@/app/components/collection";
import Charts from "@/app/components/charts";
import HeroSection from "@/app/components/hero";
import { Collection as CollectionType } from "@/types/album";

async function getCollections(): Promise<CollectionType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}

export default async function Home() {
  const collections = await getCollections();

  return (
    <div className="grid grid-cols-4 md:grid-cols-12 min-h-screen gap-4">
      <HeroSection className="col-span-8 w-full aspect-video" />
      <Charts className="col-span-4 w-full h-full" />
      <div className="flex flex-col gap-4 w-full col-span-full">
        {collections.map((collection, index) => (
          <Collection
            key={collection.name + index}
            name={collection.name}
            className="col-span-full"
            albums={collection.albums}
          />
        ))}
      </div>
    </div>
  );
}
