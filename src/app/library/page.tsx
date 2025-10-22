import Collections from "@/app/components/collections";
import Charts from "@/app/components/charts";
import BackButton from "@/app/components/back-button";

export default async function Library() {
  return (
    <main className="grid grid-cols-4 md:grid-cols-12 min-h-screen gap-16 px-4 sm:px-6 lg:px-8">
      <div className="col-span-full mb-6 md:mb-8">
        <BackButton href="/" text="Back to Home" />
      </div>
      <Collections className="col-span-full" />
      <Charts className="col-span-full md:col-span-4" />
    </main>
  );
}
