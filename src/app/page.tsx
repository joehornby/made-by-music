import Collections from "@/app/components/collections";
import Charts from "@/app/components/charts";
import HeroSection from "@/app/components/hero";

export default async function Home() {
  return (
    <main className="grid grid-cols-4 md:grid-cols-12 min-h-screen gap-4">
      <HeroSection className="col-span-full md:col-span-8 w-full aspect-[1.8]" />
      <Charts className="col-span-full md:col-span-4" />
      <Collections />
    </main>
  );
}
