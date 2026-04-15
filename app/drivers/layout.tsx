import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Driver Hub",
  robots: privateRobots(),
};

export default function DriversLayout({ children }: { children: React.ReactNode }) {
  return children;
}
