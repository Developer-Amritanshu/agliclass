import type { Metadata } from "next";

import { privateRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Submission Status",
  robots: privateRobots(),
};

export default function SubmissionStatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
