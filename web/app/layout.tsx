import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// Three fonts maximum (launch-plan-v1.1 invariant):
//   Playfair Display → display / headings
//   Inter            → body
//   JetBrains Mono   → code
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUXOR Academy — the knowledge-ware library of the cutting-edge future",
  description:
    "A gamified learning academy converting 169 Claude skills, 55 agents, 103 commands, and a decade of shippable projects into interactive quests. Novice → Experienced → Expert.",
  metadataBase: new URL("https://academy.luxorstudios.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
