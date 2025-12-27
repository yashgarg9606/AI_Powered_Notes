import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NotesAI - AI-Powered Note Taking",
  description: "Write better notes with AI enhancement, tagging, and search",
  icons: {
    icon: [
      {
        url: "/icon-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon-32x32.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "NotesAI - AI-Powered Note Taking",
    description: "Write better notes with AI enhancement, tagging, and search",
    images: [
      {
        url: "/apple-icon.png",
        width: 1200,
        height: 630,
        alt: "NotesAI Logo",
      },
    ],
    siteName: "NotesAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotesAI - AI-Powered Note Taking",
    description: "Write better notes with AI enhancement, tagging, and search",
    images: ["/apple-icon.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
