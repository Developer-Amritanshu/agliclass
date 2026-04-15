import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order Tracking",
  robots: privateRobots(),
};

export default function BuyerOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
