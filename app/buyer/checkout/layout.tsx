import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout",
  robots: privateRobots(),
};

export default function BuyerCheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
