import { SiteHeader } from "@/components/site-header";
import { PageLoading } from "@/components/ui/page-loading";

export default function Loading() {
  return (
    <div>
      <SiteHeader />
      <PageLoading title="Loading your account" body="Pulling your orders, submissions, and latest updates." />
    </div>
  );
}
