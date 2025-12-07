"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Loader } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface AIEnhanceButtonProps {
  content: string
  onEnhanced: (text: string) => void
}

export function AIEnhanceButton({ content, onEnhanced }: AIEnhanceButtonProps) {
  const [loading, setLoading] = useState(false)
  const [enhancingType, setEnhancingType] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEnhance = async (type: "improve" | "summarize" | "expand") => {
    if (!content.trim()) {
      toast({
        title: "Empty content",
        description: "Please write some content first",
      })
      return
    }

    try {
      setLoading(true)
      setEnhancingType(type)

      const response = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      })

      if (!response.ok) throw new Error("Failed to enhance note")
      const { text } = await response.json()

      onEnhanced(text)
      toast({
        title: "Success",
        description: `Note ${type}d by AI`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance note",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setEnhancingType(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={loading || !content.trim()} className="gap-2 bg-transparent">
          {loading && enhancingType ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span className="capitalize">{enhancingType}ing...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              AI Enhance
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEnhance("improve")}>Improve Writing</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEnhance("summarize")}>Summarize</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEnhance("expand")}>Expand</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
