import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"
import { RefreshCw, Send } from "lucide-react"

export default function DraftInput({
  draft,
  setDraft,
  isGenerating,
  generateContent,
}: {
  draft: string
  setDraft: (value: string) => void
  isGenerating: boolean
  generateContent: () => void
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1">
        <Textarea
            placeholder="Enter content draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full resize-y" // Add 'resize-y' to allow vertical resizing
          />
        </div>
        <Button onClick={generateContent} disabled={!draft.trim() || isGenerating} className="md:w-auto w-full">
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter your content draft and we'll generate optimized versions for different platforms.
      </p>
    </div>
  )
}
