import { getCurrentUser } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { NotesApp } from "@/components/notes/notes-app"

export default async function AppPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div>
      <NotesApp userId={user.id} />
    </div>
  )
}
