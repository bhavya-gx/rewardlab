import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "rewardlab.vercel.app";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Rewardlab | Open-source access cards and rewards",
    description: "An open-source, MIT-licensed product experience concept for B2B AI companies: branded access cards, a creator studio and a simulated rewards flow.",
    openGraph: {
      title: "Your AI product. Your customer experience.",
      description: "See how a private customer link turns gifted AI credits into first use.",
      images: [{ url: "/og-rewardlab.png", width: 1200, height: 630, alt: "Rewardlab, an open-source access card and rewards concept" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Your AI product. Your customer experience.",
      description: "An open-source customer activation concept for B2B AI companies. MIT licensed.",
      images: ["/og-rewardlab.png"],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
