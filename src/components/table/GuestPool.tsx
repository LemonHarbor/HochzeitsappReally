import React, { useState } from "react";
import { Search, Filter, UserPlus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import { useLanguage } from "@/lib/language";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvpStatus: "confirmed" | "pending" | "declined";
  category: string;
  dietaryRestrictions?: string;
  avatar?: string;
}

interface GuestPoolProps {
  guests?: Guest[];
  onDragStart?: (guest: Guest) => void;
  onFilterChange?: (filters: any) => void;
}

const GuestPool = ({
  guests = [],
  onDragStart = () => {},
  onFilterChange = () => {},
}: GuestPoolProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRsvpStatus, setSelectedRsvpStatus] = useState<string>("");

  // Filter guests based on search term and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(guest.category);

    const matchesRsvp =
      selectedRsvpStatus === "" || guest.rsvpStatus === selectedRsvpStatus;

    return matchesSearch && matchesCategory && matchesRsvp;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleRsvpChange = (status: string) => {
    setSelectedRsvpStatus(status);
  };

  return (
    <Card className="w-full bg-card border-2 border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{t("guests.title")}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-accent" : ""}
            >
              <Filter className="h-4 w-4 mr-1" />
              {t("actions.filter")}
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              {t("guests.addGuest")}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("guests.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1.5 h-6 w-6"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t("guests.category")}:
                </span>
                <div className="flex gap-1">
                  {["family", "friends", "colleagues"].map((category) => (
                    <div key={category} className="flex items-center space-x-1">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm capitalize cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t("guests.rsvpStatus")}:
                </span>
                <Select
                  value={selectedRsvpStatus}
                  onValueChange={handleRsvpChange}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("actions.any")}</SelectItem>
                    <SelectItem value="confirmed">
                      {t("guests.confirmed")}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t("guests.pending")}
                    </SelectItem>
                    <SelectItem value="declined">
                      {t("guests.declined")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <DraggableGuest
                key={guest.id}
                guest={guest}
                onDragStart={onDragStart}
              >
                <Avatar>
                  <AvatarImage src={guest.avatar} alt={guest.name} />
                  <AvatarFallback>
                    {guest.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{guest.name}</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={
                              guest.rsvpStatus === "confirmed"
                                ? "default"
                                : guest.rsvpStatus === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="ml-2"
                          >
                            {guest.rsvpStatus}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>RSVP Status: {guest.rsvpStatus}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="truncate">{guest.email}</span>
                  </div>
                  {guest.dietaryRestrictions && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {guest.dietaryRestrictions}
                      </Badge>
                    </div>
                  )}
                </div>
              </DraggableGuest>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-8 text-muted-foreground">
              {t("guests.noGuests")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Draggable guest component using react-dnd
interface DraggableGuestProps {
  guest: Guest;
  onDragStart: (guest: Guest) => void;
  children?: React.ReactNode;
}

const DraggableGuest: React.FC<DraggableGuestProps> = ({
  guest,
  onDragStart,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "GUEST",
    item: () => {
      onDragStart(guest);
      return { ...guest, type: "GUEST" };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 rounded-md border border-border bg-background hover:bg-accent/50 cursor-grab transition-colors ${isDragging ? "opacity-50" : ""}`}
    >
      {children}
    </div>
  );
};

export default GuestPool;
