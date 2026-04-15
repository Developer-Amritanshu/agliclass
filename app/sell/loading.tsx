import { SiteHeader } from "@/components/site-header";
import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div>
      <SiteHeader />
      <PageLoading title="Loading seller flow" body="Preparing your submission and review workspace." />
    </div>
  );
}
