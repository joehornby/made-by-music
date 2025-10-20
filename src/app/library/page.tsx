import Collections from "@/app/components/collections";

export default async function Library() {
  return (
    <main className="grid grid-cols-4 md:grid-cols-12 min-h-screen gap-4">
      <Collections />
    </main>
  );
}
