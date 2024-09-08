import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface GameFiltersProps {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  features: string[];
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  allTags,
  selectedTags,
  setSelectedTags,
  features,
  selectedFeatures,
  setSelectedFeatures,
  sortOption,
  setSortOption
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={selectedTags.length > 0 ? "default" : "outline"} 
            className={`w-[120px] ${selectedTags.length > 0 ? 'bg-blue-600' : 'bg-gray-800'} text-white border-gray-700 hover:bg-gray-700 flex items-center justify-between`}
          >
            Tags
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-2">{selectedTags.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto dropdown-scroll">
          {allTags.map(tag => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={(checked) => {
                setSelectedTags(checked 
                  ? [...selectedTags, tag]
                  : selectedTags.filter(t => t !== tag)
                );
              }}
              className="text-white hover:bg-gray-700"
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant={selectedFeatures.length > 0 ? "default" : "outline"} 
            className={`w-[120px] ${selectedFeatures.length > 0 ? 'bg-blue-600' : 'bg-gray-800'} text-white border-gray-700 hover:bg-gray-700 flex items-center justify-between`}
          >
            Features
            {selectedFeatures.length > 0 && (
              <Badge variant="secondary" className="ml-2">{selectedFeatures.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto">
          {features.map(feature => (
            <DropdownMenuCheckboxItem
              key={feature}
              checked={selectedFeatures.includes(feature)}
              onCheckedChange={(checked) => {
                setSelectedFeatures(checked
                  ? [...selectedFeatures, feature]
                  : selectedFeatures.filter(f => f !== feature)
                );
              }}
              className="text-white hover:bg-gray-700"
            >
              {feature}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="default" className="text-white hover:bg-gray-700">Default</SelectItem>
          <SelectItem value="rtp" className="text-white hover:bg-gray-700">RTP</SelectItem>
          <SelectItem value="name" className="text-white hover:bg-gray-700">Game Name</SelectItem>
          <SelectItem value="provider" className="text-white hover:bg-gray-700">Provider Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameFilters;