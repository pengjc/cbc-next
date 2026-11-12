import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Archive | Carolinas Blending Conference",
  description: "Archived information from the 2026 Carolinas Blending Conference in Charleston, South Carolina.",
  openGraph: {
    title: "2026 Archive | Carolinas Blending Conference",
    description: "Archived information from the 2026 conference.",
    images: ["/cbc-logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Archive | Carolinas Blending Conference",
    description: "Archived information from the 2026 conference.",
    images: ["/cbc-logo.svg"],
  },
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-amber-100 px-4 py-3 text-center text-sm text-amber-950">
        You are viewing the 2026 conference archive. Details and registration links are historical. {" "}
        <Link className="font-semibold underline" href="/">Visit the 2027 conference page</Link>
      </div>
      {children}
    </>
  );
}
