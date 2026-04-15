import { SiteHeader } from "@/components/site-header";
import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div>
      <SiteHeader />
      <PageLoading title="Loading AgliClass" body="Getting the latest school, kit, and account details ready." />
    </div>
  );
}
