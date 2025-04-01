import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, RefreshCw, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ReactMarkdown from "react-markdown";

export default function ExpandedCardDialog({
  expandedCard,
  setExpandedCard,
  regeneratePlatform,
}: {
  expandedCard: { id: number; name: string; content: string } | null
  setExpandedCard: (value: null) => void
  regeneratePlatform: (id: number) => void
}) {
  return (
    <Dialog open={expandedCard !== null} onOpenChange={(open) => !open && setExpandedCard(null)}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]" aria-describedby="expanded-card-content">
        <DialogHeader>
          <DialogTitle>{expandedCard?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 overflow-y-auto max-h-[60vh]">
            <div className="prose dark:prose-invert">
              <ReactMarkdown>{expandedCard?.content || ""}</ReactMarkdown>
            </div>
            
          {/* <Textarea
            id="expanded-card-content"
            value={expandedCard?.content ?? ""} // Use empty string as fallback
            readOnly
            className="min-h-[300px] w-full resize-none text-base"
          /> */}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Accept
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Copy to clipboard</DropdownMenuItem>
              <DropdownMenuItem>Schedule post</DropdownMenuItem>
              <DropdownMenuItem>Post now</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => expandedCard && regeneratePlatform(expandedCard.id)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="secondary" onClick={() => setExpandedCard(null)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
