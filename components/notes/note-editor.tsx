"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TagSelector } from "./tag-selector"
import { debounce } from "lodash"
import { AIEnhanceButton } from "./ai-enhance-button"

interface Note {
  id: string
  title: string
  content: string
  tags?: Array<{ id: string; name: string; color: string }>
  note_tags?: Array<{ tag_id: string }>
}

interface NoteEditorProps {
  note: Note
  onUpdate: (note: Note) => void
  onDelete: (noteId: string) => void
  tags: Array<{ id: string; name: string; color: string }>
  onTagsChange: () => void
}

export function NoteEditor({ note, onUpdate, onDelete, tags, onTagsChange }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [selectedTags, setSelectedTags] = useState(note.note_tags?.map((nt) => nt.tag_id) || [])
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Auto-save with debounce
  const debouncedSave = useCallback(
    debounce(async (noteId: string, t: string, c: string, tagIds: string[]) => {
      try {
        setSaving(true)
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: t || "Untitled Note",
            content: c,
            tagIds,
          }),
        })

        if (!response.ok) throw new Error("Failed to save note")
        const updated = await response.json()
        onUpdate(updated)
      } catch (error) {
        console.error("Failed to save note:", error)
      } finally {
        setSaving(false)
      }
    }, 1000),
    [onUpdate],
  )

  // Save on title/content/tags change
  useEffect(() => {
    debouncedSave(note.id, title, content, selectedTags)
  }, [title, content, selectedTags, debouncedSave, note.id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Editor Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50 flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
        />
        <div className="flex items-center gap-2">
          <AIEnhanceButton content={content} onEnhanced={setContent} />
          {saving && <span className="text-xs text-muted-foreground">Saving...</span>}
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-6 py-3 border-b border-border bg-card/25">
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          availableTags={tags}
          onCreateTag={onTagsChange}
        />
      </div>

      {/* Editor Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        className="flex-1 px-6 py-4 bg-background text-foreground border-0 focus:outline-none resize-none focus-visible:ring-0"
      />
    </div>
  )
}
