import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollButtons({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`absolute ${
        direction === "left" ? "-left-4" : "-right-4"
      } top-1/2 transform -translate-y-1/2 z-10 hidden md:flex`}
      onClick={onClick}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
