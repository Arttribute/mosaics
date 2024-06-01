"use client";
import { Chakra_Petch } from "next/font/google";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const chakra_petch = Chakra_Petch({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_HUDDLE_PROJECT_ID!,
  });
  return (
    <html lang="en">
      <body className={chakra_petch.className}>
        <HuddleProvider client={huddleClient}>{children}</HuddleProvider>
      </body>
    </html>
  );
}
