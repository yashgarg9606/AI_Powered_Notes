"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: Array<{ id: string; name: string; color: string }>
  onCreateTag: () => void
}

export function TagSelector({ selectedTags, onTagsChange, availableTags, onCreateTag }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId))
    } else {
      onTagsChange([...selectedTags, tagId])
    }
  }

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

      const newTag = await response.json()
      setNewTagName("")
      onCreateTag()
      onTagsChange([...selectedTags, newTag.id])
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

  const selectedTagObjects = availableTags.filter((t) => selectedTags.includes(t.id))

  return (
    <div className="space-y-2">
      {/* Selected Tags Display */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagObjects.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: tag.color + "20",
                color: tag.color,
              }}
            >
              {tag.name}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Tag Selector Button */}
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="sm" className="w-full">
        <Plus className="w-3 h-3 mr-1" />
        {selectedTags.length > 0 ? `${selectedTags.length} tags` : "Add tags"}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bg-card border border-border rounded-lg shadow-lg p-3 z-10 w-64 space-y-2">
          {/* Create New Tag */}
          <div className="space-y-2 pb-2 border-b border-border">
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
              size="sm"
            />
            <Button
              onClick={handleCreateTag}
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
              disabled={isCreating || !newTagName.trim()}
            >
              <Plus className="w-3 h-3 mr-1" />
              Create
            </Button>
          </div>

          {/* Available Tags */}
          <div className="space-y-1">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                  selectedTags.includes(tag.id) ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => {}}
                  className="w-4 h-4 rounded"
                />
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
