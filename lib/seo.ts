export const siteConfig = {
  name: "AgliClass",
  shortName: "AgliClass",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://agliclass-startup.vercel.app",
  description:
    "AgliClass helps parents buy verified school book kits and sell used school books through a hyperlocal school book resale network in India.",
  defaultTitle: "AgliClass | School Book Kits, Used School Books, and Book Resale",
  keywords: [
    "AgliClass",
    "school book kits",
    "used school books",
    "school book resale",
    "buy school books online",
    "sell school books online",
    "book reselling",
    "school books startup",
    "school syllabus book kits",
    "book kits for schools",
    "used textbooks India",
    "Dehradun school books",
    "Uttarakhand school books",
  ],
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function privateRobots() {
  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  } as const;
}
