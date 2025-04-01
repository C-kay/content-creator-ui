"use client"

import { useState, useRef } from "react"
import axios from "axios"
import DraftInput from "./DraftInput"
import PlatformCard from "./PlatformCard"
import ExpandedCardDialog from "./ExpandedCardDialog"
import ScrollButtons from "./ScrollButtons"

// Sample data for the social media platforms
const platforms = [
  {
    id: 1,
    name: "LinkedIn",
    content:
      "Excited to share that our team has developed a new content creation tool that helps generate optimized posts for different social media platforms. This innovation will save marketers hours of work while ensuring consistent messaging across channels. #ContentCreation #MarketingTools #Innovation",
  },
  {
    id: 2,
    name: "Instagram",
    content:
      "✨ New tool alert! ✨\n\nSay goodbye to rewriting the same content for different platforms. Our new AI-powered content creator does the heavy lifting for you!\n\nTry it today and see the magic happen ✨\n\n#ContentCreation #SocialMediaTools #DigitalMarketing",
  },
  {
    id: 3,
    name: "Twitter",
    content:
      "Just launched our new content creation tool! 🚀 One draft, multiple optimized posts. Save time and boost engagement across all your social platforms. #ContentCreation",
  },
  {
    id: 4,
    name: "Facebook",
    content:
      "We're thrilled to announce the launch of our new content creation tool! Now you can write once and optimize for all your social media channels with just a click. Perfect for busy marketers and social media managers who want to maintain a consistent presence without the extra work.",
  },
  {
    id: 5,
    name: "TikTok",
    content:
      "New content creation tool just dropped! 📱 Write once, post everywhere! #ContentCreation #SocialMedia #MarketingTips",
  },
]

export default function ContentCreator() {
  const [draft, setDraft] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<typeof platforms>(platforms)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [expandedCard, setExpandedCard] = useState<(typeof platforms)[0] | null>(null)

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

  const generateContent = async () => {
    if (!draft.trim()) return
    setIsGenerating(true)
    try {
      const response = await axios.post("http://localhost:8000/execute_workflow", { topic_draft: draft })
      platforms.forEach((platform) => platform.content= response.data.post_content)
      setGeneratedContent(platforms)
      console.log("response content:", response.data)
      console.log("Generated content:", platforms)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const regeneratePlatform = async (id: number) => {
    const platformIndex = generatedContent.findIndex((p) => p.id === id)
    if (platformIndex === -1) return
    try {
      const response = await axios.post("http://localhost:8000/execute_workflow", { topic_draft: draft })
      const updatedContent = [...generatedContent]
      updatedContent[platformIndex] = response.data.post_content
      setGeneratedContent(updatedContent)
      if (expandedCard && expandedCard.id === id) {
        setExpandedCard(updatedContent[platformIndex])
      }
    } catch (error) {
      console.error("Error regenerating platform content:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <DraftInput
        draft={draft}
        setDraft={setDraft}
        isGenerating={isGenerating}
        generateContent={generateContent}
      />
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
              onClick={() => setExpandedCard(platform)}
              regeneratePlatform={regeneratePlatform}
            />
          ))}
        </div>
        <ScrollButtons direction="right" onClick={scrollRight} />
      </div>
      <ExpandedCardDialog
        expandedCard={expandedCard}
        setExpandedCard={setExpandedCard}
        regeneratePlatform={regeneratePlatform}
      />
    </div>
  )
}

