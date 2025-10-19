import Collection from "@/app/components/collection";
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

export default async function Collections() {
  const collections = await getCollections();

  return (
    <div className="mt-12 flex flex-col gap-4 w-full col-span-full">
      {collections.map((collection, index) => (
        <Collection
          key={collection.name + index}
          name={collection.name}
          className="col-span-full"
          albums={collection.albums}
        />
      ))}
    </div>
  );
}
