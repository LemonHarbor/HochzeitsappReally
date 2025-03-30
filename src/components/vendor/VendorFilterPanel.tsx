import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { VendorPreferences } from "@/services/recommendationService";

interface VendorFilterPanelProps {
  preferences: VendorPreferences;
  categories: string[];
  styleOptions: string[];
  onCategoryChange: (category: string) => void;
  onStyleChange: (style: string) => void;
  onPreferencesChange: (preferences: VendorPreferences) => void;
  onApply: () => void;
}

export const VendorFilterPanel: React.FC<VendorFilterPanelProps> = ({
  preferences,
  categories,
  styleOptions,
  onCategoryChange,
  onStyleChange,
  onPreferencesChange,
  onApply,
}) => {
  // Get category display name
  const getCategoryDisplay = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Handle budget change
  const handleBudgetChange = (value: number[]) => {
    onPreferencesChange({
      ...preferences,
      budget: { min: value[0], max: value[1] || preferences.budget.max },
    });
  };

  // Handle rating change
  const handleRatingChange = (value: number[]) => {
    onPreferencesChange({
      ...preferences,
      rating: value[0],
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                preferences.categories?.includes(category)
                  ? "default"
                  : "outline"
              }
              className="cursor-pointer"
              onClick={() => onCategoryChange(category)}
            >
              {getCategoryDisplay(category)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Style</h3>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <Badge
              key={style}
              variant={
                preferences.style?.includes(style) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() => onStyleChange(style)}
            >
              {getCategoryDisplay(style)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Budget Range</h3>
        <Slider
          defaultValue={[preferences.budget.min, preferences.budget.max]}
          max={10000}
          step={100}
          onValueChange={handleBudgetChange}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${preferences.budget.min}</span>
          <span>${preferences.budget.max}</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
        <Slider
          defaultValue={[preferences.rating]}
          max={5}
          step={0.5}
          onValueChange={handleRatingChange}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>{preferences.rating} stars</span>
        </div>
      </div>

      <Button className="w-full" onClick={onApply}>
        Apply Filters
      </Button>
    </div>
  );
};
