"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, X } from "lucide-react"
import { TagList } from "./tag-list"

interface NotesSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Array<{ id: string; name: string; color: string }>
  selectedTag: string | null
  onSelectTag: (tagId: string | null) => void
  onCreateNote: () => void
  onCreateTag: () => void
  search: string
  onSearchChange: (search: string) => void
}

export function NotesSidebar({
  open,
  onOpenChange,
  tags,
  selectedTag,
  onSelectTag,
  onCreateNote,
  onCreateTag,
  search,
  onSearchChange,
}: NotesSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-50 h-screen w-64 bg-card border-r border-border
          flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg">NotesAI</h2>
          <button onClick={() => onOpenChange(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <Button
            onClick={() => {
              onCreateNote()
              onOpenChange(false)
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex-1 overflow-y-auto border-t border-border">
          <TagList tags={tags} selectedTag={selectedTag} onSelectTag={onSelectTag} onCreateTag={onCreateTag} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
          <p>© 2025 NotesAI</p>
        </div>
      </div>
    </>
  )
}
