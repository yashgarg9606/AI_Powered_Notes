import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/app")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/95">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              AI
            </div>
            <span className="text-xl font-bold">NotesAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-balance">
              Write Better Notes with <span className="text-primary">AI Power</span>
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Enhance your note-taking with AI-powered suggestions, instant tagging, and intelligent search. Your ideas,
              perfectly refined.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          {/* Feature Grid Preview */}
          <div className="grid sm:grid-cols-3 gap-6 pt-16">
            <div className="bg-card rounded-lg p-6 border border-border text-left">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2">AI Enhancement</h3>
              <p className="text-sm text-muted-foreground">Get AI suggestions to improve clarity, grammar, and tone</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border text-left">
              <div className="text-3xl mb-3">🏷️</div>
              <h3 className="font-semibold text-lg mb-2">Smart Tagging</h3>
              <p className="text-sm text-muted-foreground">Organize notes with intelligent auto-tagging and search</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border text-left">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Fast & Sync</h3>
              <p className="text-sm text-muted-foreground">
                Instant sync across devices with lightning-fast performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NotesAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
