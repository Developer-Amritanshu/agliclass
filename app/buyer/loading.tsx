import { SiteHeader } from "@/components/site-header";
import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div>
      <SiteHeader />
      <PageLoading title="Loading kits" body="Checking schools, cities, and verified bundle availability." />
    </div>
  );
}
