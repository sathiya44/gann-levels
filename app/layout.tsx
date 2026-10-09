import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gann Square of 9 Calculator",
  description:
    "Calculate Gann Square of 9 support and resistance levels from a swing point.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
