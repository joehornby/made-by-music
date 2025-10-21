import Collections from "@/app/components/collections";
import PageContainer from "@/app/components/page-container";

export default async function Library() {
  return (
    <PageContainer
      backButtonHref="/"
      backButtonText="Back to Home"
      maxWidth="max-w-none"
      className="grid grid-cols-4 md:grid-cols-12 gap-4"
    >
      <Collections />
    </PageContainer>
  );
}
