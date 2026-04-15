import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sell Books Submission",
  robots: privateRobots(),
};

export default function SellSubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
