"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NoteEditor } from "./note-editor"
import { NotesList } from "./notes-list"
import { NotesSidebar } from "./notes-sidebar"
import { useToast } from "@/hooks/use-toast"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  note_tags?: Array<{ tag_id: string }>
  tags?: Array<{ id: string; name: string; color: string }>
}

interface Tag {
  id: string
  name: string
  color: string
}

interface NotesAppProps {
  userId: string
}

export function NotesApp({ userId }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { toast } = useToast()

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (selectedTag) params.append("tag", selectedTag)

      const response = await fetch(`/api/notes?${params}`)
      if (!response.ok) throw new Error("Failed to fetch notes")

      const data: Note[] = await response.json()
      setNotes(data)

      // Keep a selected note if possible; otherwise choose the first
      if (data.length === 0) {
        setSelectedNote(null)
      } else if (!selectedNote || !data.find(n => n.id === selectedNote.id)) {
        setSelectedNote(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
    // 🔴 IMPORTANT: do NOT include selectedNote here
  }, [search, selectedTag, toast])

  // Fetch tags
  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")

      const data: Tag[] = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  }, [])

  // Initial load + refresh when search/filter change
  useEffect(() => {
    fetchNotes()
    fetchTags()
    // search/selectedTag are already deps of fetchNotes
  }, [fetchNotes, fetchTags])

  // Create new note
  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          tagIds: [],
        }),
      })

      if (!response.ok) throw new Error("Failed to create note")

      const newNote: Note = await response.json()
      setNotes(prev => [newNote, ...prev])
      setSelectedNote(newNote)
      toast({
        title: "Success",
        description: "New note created",
      })
    } catch (error) {
      console.error("Failed to create note:", error)
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      })
    }
  }

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete note")

      setNotes(prev => prev.filter(n => n.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(prev => {
          const remaining = notes.filter(n => n.id !== noteId)
          return remaining[0] ?? null
        })
      }

      toast({
        title: "Success",
        description: "Note deleted",
      })
    } catch (error) {
      console.error("Failed to delete note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  // Update note (after successful save)
  const handleUpdateNote = (updated: Note) => {
    setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)))
    if (selectedNote?.id === updated.id) {
      setSelectedNote(updated)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <NotesSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        onCreateNote={handleCreateNote}
        onCreateTag={fetchTags}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden px-4 py-3 border-b border-border bg-card flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 bg-transparent"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <span className="font-semibold">NotesAI</span>
        </div>

        {/* Notes List (Hidden on Mobile by Default) */}
        <div className="hidden md:flex">
          <NotesList
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={note => {
              setSelectedNote(note)
              setSidebarOpen(false)
            }}
            loading={loading}
          />
        </div>

        {/* Note Editor or Empty State */}
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={handleUpdateNote as (note: any) => void}
            onDelete={handleDeleteNote}
            tags={tags}
            onTagsChange={fetchTags}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <div className="text-6xl">📝</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">No note selected</h2>
                <p className="text-muted-foreground mb-6">
                  Create a new note or select one from the list
                </p>
                <Button
                  onClick={handleCreateNote}
                  className="bg-primary hover:bg-primary/90"
                >
                  Create First Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
