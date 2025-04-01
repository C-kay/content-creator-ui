import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, RefreshCw } from "lucide-react"
import ReactMarkdown from "react-markdown";

export default function PlatformCard({
  platform,
  onClick,
  regeneratePlatform,
}: {
  platform: { id: number; name: string; content: string }
  onClick: () => void
  regeneratePlatform: (id: number) => void
}) {
  return (
    <Card
      className="min-w-[320px] max-w-[400px] flex-shrink-0 snap-start cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{platform.name}</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="min-h-[200px] max-h-[300px] overflow-y-auto prose prose-sm dark:prose-invert">
        <ReactMarkdown>{platform.content}</ReactMarkdown>
      </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" onClick={(e) => e.stopPropagation()}>
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
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            regeneratePlatform(platform.id)
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  )
}
