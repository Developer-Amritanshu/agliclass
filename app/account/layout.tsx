import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Account",
  robots: privateRobots(),
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
