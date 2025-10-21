import { Suspense } from "react";
import SearchResults from "./search-results-client";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-black">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-light mb-8">
          {searchParams.q ? `Search results for "${searchParams.q}"` : "Search"}
        </h1>
        <Suspense fallback={<div className="text-light">Loading...</div>}>
          <SearchResults query={searchParams.q} />
        </Suspense>
      </div>
    </div>
  );
}
