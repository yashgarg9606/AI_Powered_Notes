import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NotesAI - My Notes",
  description: "Your AI-powered notes app",
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
