import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Figtree, Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "GeoSkills Atlas",
    template: "%s · GeoSkills Atlas",
  },
  description:
    "Faculty database of geospatial skillsets, competencies, objectives, outcomes, and course exercises.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${figtree.variable} ${fraunces.variable} h-full antialiased`}
      >
        <body className="page-shell min-h-full flex flex-col text-ink">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-line px-6 py-8 text-sm text-ink-soft">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="display text-base text-ink">GeoSkills Atlas</p>
              <p>Course planning reference for geospatial faculty.</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
