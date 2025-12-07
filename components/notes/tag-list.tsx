"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TagListProps {
  tags: Array<{ id: string; name: string; color: string }>
  selectedTag: string | null
  onSelectTag: (tagId: string | null) => void
  onCreateTag: () => void
}

export function TagList({ tags, selectedTag, onSelectTag, onCreateTag }: TagListProps) {
  const [newTagName, setNewTagName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      setIsCreating(true)
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName }),
      })

      if (!response.ok) throw new Error("Failed to create tag")

      setNewTagName("")
      onCreateTag()
      toast({
        title: "Success",
        description: "Tag created",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Create Tag Form */}
      <div className="space-y-2">
        <Input
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTag()
            }
          }}
          disabled={isCreating}
        />
        <Button
          onClick={handleCreateTag}
          size="sm"
          variant="outline"
          className="w-full bg-transparent"
          disabled={isCreating || !newTagName.trim()}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Tag
        </Button>
      </div>

      {/* Tags List */}
      <div className="space-y-2">
        <button
          onClick={() => onSelectTag(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
            selectedTag === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          All Notes
        </button>

        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelectTag(tag.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
              selectedTag === tag.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  )
}
