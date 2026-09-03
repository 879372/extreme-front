import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Extreme Software — Tecnologia para organizar seu negócio",
  description: "Sistemas personalizados e acessíveis para pequenos e médios negócios organizarem a rotina, controlarem seus números e crescerem.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Extreme Software — Menos papel. Mais controle.",
    description: "Software sob medida e acessível para pequenos e médios empreendedores.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Extreme Software" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
