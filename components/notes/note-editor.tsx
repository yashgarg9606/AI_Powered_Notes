"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TagSelector } from "./tag-selector"
import debounce from "lodash.debounce"
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

const SAVE_DELAY = 800

export function NoteEditor({
  note,
  onUpdate,
  onDelete,
  tags,
  onTagsChange,
}: NoteEditorProps) {
  const { toast } = useToast()

  // Local state mirrors the current note
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [selectedTags, setSelectedTags] = useState<string[]>(
    note.note_tags?.map((nt) => nt.tag_id) || []
  )
  const [saving, setSaving] = useState(false)

  // When switching to a different note, reset editor state
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setSelectedTags(note.note_tags?.map((nt) => nt.tag_id) || [])
  }, [note.id])

  // Stable debounced save function (created once per note id)
  const debouncedSave = useMemo(
    () =>
      debounce(
        async (t: string, c: string, tagIds: string[]) => {
          try {
            setSaving(true)
            const response = await fetch(`/api/notes/${note.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: t || "Untitled Note",
                content: c,
                tagIds,
              }),
            })

            if (!response.ok) {
              const body = await response.json().catch(() => null)
              console.error("Failed to save note:", response.status, body)
              toast({
                title: "Error",
                description: "Failed to save note",
                variant: "destructive",
              })
              return
            }

            const updated = await response.json()
            onUpdate(updated)
          } catch (error) {
            console.error("Failed to save note:", error)
            toast({
              title: "Error",
              description: "Failed to save note",
              variant: "destructive",
            })
          } finally {
            setSaving(false)
          }
        },
        SAVE_DELAY
      ),
    [note.id, onUpdate, toast]
  )

  // Optional: cancel pending save when component unmounts or note id changes
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  // Handlers – these are the ONLY places we trigger autosave
  const handleTitleChange = (value: string) => {
    setTitle(value)
    debouncedSave(value, content, selectedTags)
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    debouncedSave(title, value, selectedTags)
  }

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTags(tagIds)
    debouncedSave(title, content, tagIds)
  }

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
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
        />
        <div className="flex items-center gap-2">
          <AIEnhanceButton
            content={content}
            onEnhanced={(text) => handleContentChange(text)}
          />
          {saving && (
            <span className="text-xs text-muted-foreground">Saving...</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div className="px-6 py-3 border-b border-border bg-card/25">
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          availableTags={tags}
          onCreateTag={onTagsChange}
        />
      </div>

      {/* Editor Content */}
      <textarea
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder="Start typing your note..."
        className="flex-1 px-6 py-4 bg-background text-foreground border-0 focus:outline-none resize-none focus-visible:ring-0"
      />
    </div>
  )
}
