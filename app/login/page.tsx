import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect("/app")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-background/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              AI
            </div>
            <span className="text-2xl font-bold">NotesAI</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 mb-6">
          <LoginForm />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}
