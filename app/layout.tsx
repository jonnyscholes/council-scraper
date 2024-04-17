import "./globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Mural Comission Finder",
  description: "A database of mural comissions in Australia.",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
