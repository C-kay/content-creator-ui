"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "./ui/textarea"
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
  // { id: 3, name: "Twitter" },
  // { id: 4, name: "Facebook" },
  // { id: 5, name: "TikTok" },
  { id: 6, name: "Blog Post" },
]


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
      const response = await axios.post("https://content-generator-deterministic.onrender.com/execute_workflow", {
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

  const regeneratePlatform = async (id: number) => {
    const platform = generatedContent.find((p) => p.id === id)
    if (!platform) return

    setIsGenerating(true)

    try {
      const response = await axios.post("https://content-generator-deterministic.onrender.com/execute_single_platform", {
        topic_draft: draft,
        platforms: [platform.name],
      })

      const updatedContent = [...generatedContent]
      const platformIndex = updatedContent.findIndex((p) => p.id === id)
      if (platformIndex !== -1) {
        updatedContent[platformIndex] = {
          id: response.data.id,
          name: response.data.name,
          content: response.data.content,
        }
        setGeneratedContent(updatedContent)

        if (expandedCard && expandedCard.id === id) {
          setExpandedCard(updatedContent[platformIndex])
        }
      }
    } catch (error) {
      console.error("Error regenerating platform content:", error)
    } finally {
      setIsGenerating(false)
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
            <Textarea
              placeholder="Enter content draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
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

