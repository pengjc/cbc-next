import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Carolinas Blending Conference 2026 | Charleston, SC",
  description: "Join us for the Carolinas Blending Conference January 17-18, 2026 in Charleston, SC. General subject: Proclaiming the Gospel, Christ as the Jubilee of Grace.",
  icons: {
    icon: '/cbc-logo.svg',
    apple: '/cbc-logo.svg',
  },
  openGraph: {
    title: "Carolinas Blending Conference 2026",
    description: "January 17-18, 2026 in Charleston, SC. Proclaiming the Gospel, Christ as the Jubilee of Grace.",
    url: "https://carolinasblendingconference.org",
    siteName: "Carolinas Blending Conference",
    images: [
      {
        url: '/cbc-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Carolinas Blending Conference 2026',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Carolinas Blending Conference 2026",
    description: "January 17-18, 2026 in Charleston, SC. Proclaiming the Gospel, Christ as the Jubilee of Grace.",
    images: ['/cbc-logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
