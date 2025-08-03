import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals-optimized.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { CriticalPreloader } from "@/components/critical-preloader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glow by FC - Your Daily Dose of Glow & Style",
  description:
    "Découvrez notre collection exclusive de bijoux et accessoires créée avec passion en Tunisie. Livraison gratuite dès 99dt. DM to shop via Instagram @glow_by_fc",
  keywords: "bijoux tunisie, accessoires femme, glow by fc, farah charabi, livraison tunisie, instagram shop",
  openGraph: {
    title: "Glow by FC - Accessoires de Luxe",
    description: "Your daily dose of glow & style ✨ Créé en Tunisie par @farah.charabi",
    images: ["/assets/logo.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CriticalPreloader />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
