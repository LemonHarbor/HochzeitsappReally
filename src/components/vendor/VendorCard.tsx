import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import { Vendor } from "../../../../src/types/vendor";
import RatingStars from "./RatingStars";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
  rating: number;
  onViewDetails: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  rating,
  onViewDetails,
}) => {
  // Get category display name
  const getCategoryDisplay = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card
      className="overflow-hidden hover:border-primary cursor-pointer transition-colors"
      onClick={onViewDetails}
    >
      <CardHeader className="pb-1 sm:pb-2 bg-muted/30 p-3 sm:p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm sm:text-base truncate">
              {vendor.name}
            </CardTitle>
            <Badge variant="outline" className="mt-1 text-xs">
              {getCategoryDisplay(vendor.category)}
            </Badge>
          </div>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm font-bold mr-1">
              {rating.toFixed(1)}
            </span>
            <RatingStars rating={rating} size="sm" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-3 p-3 sm:p-4">
        <div className="space-y-2">
          {vendor.contact_name && (
            <div className="text-xs sm:text-sm truncate">
              <span className="font-medium">Contact:</span>{" "}
              {vendor.contact_name}
            </div>
          )}

          {vendor.address && (
            <div className="flex items-center text-xs sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{vendor.address}</span>
            </div>
          )}

          {vendor.phone && (
            <div className="flex items-center text-xs sm:text-sm">
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground flex-shrink-0" />
              <span>{vendor.phone}</span>
            </div>
          )}

          {vendor.email && (
            <div className="flex items-center text-xs sm:text-sm">
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground flex-shrink-0" />
              <a
                href={`mailto:${vendor.email}`}
                className="text-primary hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {vendor.email}
              </a>
            </div>
          )}

          {vendor.website && (
            <div className="flex items-center text-xs sm:text-sm">
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground flex-shrink-0" />
              <a
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {vendor.website.replace(/^https?:\/\//i, "")}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
