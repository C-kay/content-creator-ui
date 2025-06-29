"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X, Check } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatforms: number[];
  togglePlatform: (platformId: number) => void;
  selectAllPlatforms: () => void;
  clearPlatformSelection: () => void;
  availablePlatforms: Array<{ id: number; name: string }>;
}

export default function PlatformSelector({
  selectedPlatforms,
  togglePlatform,
  selectAllPlatforms,
  clearPlatformSelection,
  availablePlatforms,
}: PlatformSelectorProps) {
  const selectedCount = selectedPlatforms.length;
  const totalPlatforms = availablePlatforms.length;
  const isAllSelected = selectedCount === totalPlatforms;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-shrink-0">
          {selectedCount === 0
            ? "Select platforms"
            : isAllSelected
            ? "All platforms"
            : `${selectedCount} platform${selectedCount !== 1 ? "s" : ""}`}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Content Platforms</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availablePlatforms.map((platform) => (
          <DropdownMenuCheckboxItem
            key={platform.id}
            checked={selectedPlatforms.includes(platform.id)}
            onCheckedChange={() => togglePlatform(platform.id)}
          >
            {platform.name}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={selectAllPlatforms}>
          <Check className="mr-2 h-4 w-4" />
          Select All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={clearPlatformSelection}>
          <X className="mr-2 h-4 w-4" />
          Clear Selection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
