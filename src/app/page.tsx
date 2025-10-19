import Collection from "@/app/components/collection";
import Charts from "@/app/components/charts";
import HeroSection from "@/app/components/hero";

export default function Home() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-12 p-4 md:p-8 min-h-screen gap-8">
      <HeroSection className="col-span-8 w-full aspect-video" />
      <Charts className="col-span-4 w-full h-full" />
      <Collection name="New Releases" className="col-span-full h-[30vh]" />
      <Collection name="Recently Played" className="col-span-full h-[30vh]" />
      <Collection name="Made for You" className="col-span-full h-[30vh]" />
    </div>
  );
}
