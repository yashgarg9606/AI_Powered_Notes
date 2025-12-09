"use client"

import { formatDistanceToNow } from "date-fns"
import { FileText } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface NotesListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  loading: boolean
}

export function NotesList({ notes, selectedNote, onSelectNote, loading }: NotesListProps) {
  if (loading) {
    return (
      <div className="w-64 border-r border-border bg-card/50 p-4">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-border bg-card/50 overflow-y-auto">
      <div className="p-4 space-y-2">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes</p>
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedNote?.id === note.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              <div className="font-semibold truncate">{note.title || "Untitled"}</div>
              <div className="text-xs opacity-75 truncate">{note.content?.substring(0, 50) || "No content"}</div>
              <div className="text-xs opacity-50 mt-1">
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
