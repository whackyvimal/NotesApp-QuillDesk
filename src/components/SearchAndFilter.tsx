import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Filter, X, Check } from "lucide-react";
import { NoteFilter } from "@/types/note";
import { cn } from "@/lib/utils";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  activeFilter: NoteFilter;
  onFilterChange: (filter: NoteFilter) => void;
  noteCounts: Record<NoteFilter, number>;
}

export const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  availableTags,
  activeFilter,
  onFilterChange,
  noteCounts,
}: SearchAndFilterProps) => {
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  const filterOptions: { key: NoteFilter; label: string; icon: string }[] = [
    { key: "all", label: "All Notes", icon: "📝" },
    { key: "pinned", label: "Pinned", icon: "📌" },
    { key: "archived", label: "Archived", icon: "📦" },
    { key: "trash", label: "Trash", icon: "🗑️" },
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange("");
    onTagsChange([]);
    onFilterChange("all");
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || activeFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search notes by title or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-2 focus:border-primary transition-colors"
        />
      </div>

      {/* Filter Buttons and Tag Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Status Filter Buttons */}
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.key}
              variant={activeFilter === option.key ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(option.key)}
              className={cn(
                "transition-all duration-200",
                activeFilter === option.key && "bg-gradient-to-r from-primary to-accent shadow-md"
              )}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {noteCounts[option.key]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="border-2">
                <Filter className="h-4 w-4 mr-1" />
                Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() => toggleTag(tag)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Tag Filters Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground self-center">Filtering by:</span>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};