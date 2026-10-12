import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans, VT323 } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-teletext",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "resumotion° TV",
  description: "Your resume, as a film made for you. Not a template.",
  openGraph: {
    title: "resumotion° TV",
    description: "Your resume, as a film made for you. Not a template.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${ibmPlex.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  );
}
