"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, RefreshCw } from "lucide-react"
import axios from "axios"

import PlatformCard from "./PlatformCard"
import ExpandedCardDialog from "./ExpandedCardDialog"
import ScrollButtons from "./ScrollButtons"
import PlatformSelector from "./PlatformSelector"

// Available platform types
const availablePlatforms = [
  { id: 1, name: "LinkedIn" },
  { id: 2, name: "Instagram" },
  { id: 3, name: "Twitter" },
  { id: 4, name: "Facebook" },
  { id: 5, name: "TikTok" },
  { id: 6, name: "Blog Post" },
]

interface Response {
  content?: Array<{ id: number; name: string; content: string }>
}

// Sample data for the social media platforms
const platformContent = {
  LinkedIn: `### Professional Growth Post\n\n**Excited to share** that our team has developed a new content creation tool...`,
  Instagram: `✨ **New tool alert!** ✨\n\nSay goodbye to rewriting the same content for different platforms...`,
  Twitter: `Just launched our new content creation tool! 🚀\n\nOne draft, multiple optimized posts...`,
  Facebook: `We're thrilled to announce the launch of our new content creation tool!\n\nNow you can write once...`,
  TikTok: `New content creation tool just dropped! 📱\n\nWrite once, post everywhere!...`,
  "Blog Post": `# Introducing Our New Content Creation Tool: Write Once, Share Everywhere\n\n*Posted on March 31, 2025...`,
}

export default function ContentCreator() {
  const [draft, setDraft] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<Array<{ id: number; name: string; content: string }>>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [expandedCard, setExpandedCard] = useState<{ id: number; name: string; content: string } | null>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]
    )
  }

  const selectAllPlatforms = () => {
    setSelectedPlatforms(availablePlatforms.map((platform) => platform.id))
  }

  const clearPlatformSelection = () => {
    setSelectedPlatforms([])
  }

  const generateContent = async () => {
    if (!draft.trim() || selectedPlatforms.length === 0) return

    setIsGenerating(true)

    try {
      const response = await axios.post("http://localhost:8000/execute_workflow", {
        topic_draft: draft,
        platforms: selectedPlatforms.map((platformId) => {
          const platform = availablePlatforms.find((p) => p.id === platformId)
          return platform ? platform.name : null
        }).filter(Boolean),
      })
  
      const newContent = response.data.content.map((content: { id: number; name: string; content: string }) => ({
        id: content.id,
        name: content.name,
        content: content.content,
      }))

      setGeneratedContent(newContent)
      setHasGenerated(true)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const regeneratePlatform = (id: number) => {
    const platformIndex = generatedContent.findIndex((p) => p.id === id)
    if (platformIndex === -1) return

    const updatedContent = [...generatedContent]
    updatedContent[platformIndex] = {
      ...updatedContent[platformIndex],
      content: `${updatedContent[platformIndex].content}\n\n*Regenerated at ${new Date().toLocaleTimeString()}*`,
    }

    setGeneratedContent(updatedContent)

    if (expandedCard && expandedCard.id === id) {
      setExpandedCard(updatedContent[platformIndex])
    }
  }

  const handleCardClick = (platform: { id: number; name: string; content: string }) => {
    setExpandedCard(platform)
  }


  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Enter content draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              togglePlatform={togglePlatform}
              selectAllPlatforms={selectAllPlatforms}
              clearPlatformSelection={clearPlatformSelection}
              availablePlatforms={availablePlatforms}
            />
            <Button
              onClick={generateContent}
              disabled={!draft.trim() || isGenerating || selectedPlatforms.length === 0}
              className="md:w-auto w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your content draft, select platforms, and we'll generate optimized versions for each.
        </p>
      </div>
      {hasGenerated && generatedContent.length > 0 ? (
        <div className="relative">
          <ScrollButtons direction="left" onClick={scrollLeft} />
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 md:px-4 snap-x scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {generatedContent.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onClick={() => handleCardClick(platform)}
                regeneratePlatform={regeneratePlatform}
              />
            ))}
          </div>
          <ScrollButtons direction="right" onClick={scrollRight} />
        </div>
      ) : hasGenerated ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-lg text-muted-foreground">
            No platforms selected. Please select at least one platform to generate content.
          </p>
        </div>
      ) : null}
      <ExpandedCardDialog
        expandedCard={expandedCard}
        setExpandedCard={setExpandedCard}
        regeneratePlatform={regeneratePlatform}
      />
    </div>
  )
}

