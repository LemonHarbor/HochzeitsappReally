import { ChecklistTemplate } from "@/types/timeline";

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: "wedding-essentials",
    name: "Wedding Essentials",
    description:
      "Core tasks that every couple needs to complete for their wedding",
    tasks: [
      { name: "Set wedding date", timeframe: "12-months" },
      { name: "Create guest list", timeframe: "12-months" },
      { name: "Set wedding budget", timeframe: "12-months" },
      { name: "Book venue", timeframe: "12-months" },
      { name: "Book caterer", timeframe: "9-months" },
      { name: "Book photographer", timeframe: "9-months" },
      { name: "Book videographer", timeframe: "9-months" },
      { name: "Book florist", timeframe: "6-months" },
      { name: "Book DJ/band", timeframe: "6-months" },
      { name: "Order wedding cake", timeframe: "4-months" },
      { name: "Purchase wedding attire", timeframe: "6-months" },
      { name: "Order invitations", timeframe: "4-months" },
      { name: "Send invitations", timeframe: "3-months" },
      { name: "Create seating chart", timeframe: "1-month" },
      { name: "Finalize menu", timeframe: "1-month" },
      { name: "Write vows", timeframe: "1-month" },
      { name: "Final venue walkthrough", timeframe: "1-week" },
      { name: "Confirm all vendors", timeframe: "1-week" },
    ],
  },
  {
    id: "destination-wedding",
    name: "Destination Wedding",
    description:
      "Additional tasks for couples planning a wedding away from home",
    tasks: [
      { name: "Research destination locations", timeframe: "12-months" },
      { name: "Check passport/visa requirements", timeframe: "12-months" },
      { name: "Book venue site visit", timeframe: "10-months" },
      { name: "Research local marriage requirements", timeframe: "10-months" },
      { name: "Book accommodations for guests", timeframe: "9-months" },
      { name: "Arrange transportation for guests", timeframe: "6-months" },
      { name: "Create welcome bags", timeframe: "2-months" },
      { name: "Plan welcome dinner/event", timeframe: "6-months" },
      { name: "Plan activities for guests", timeframe: "4-months" },
      { name: "Arrange shipping of items", timeframe: "2-months" },
      { name: "Create travel itinerary", timeframe: "2-months" },
      { name: "Send travel information to guests", timeframe: "3-months" },
    ],
  },
  {
    id: "diy-wedding",
    name: "DIY Wedding",
    description:
      "Tasks for couples planning to create their own decorations and details",
    tasks: [
      { name: "Create wedding mood board", timeframe: "12-months" },
      { name: "Design and print invitations", timeframe: "6-months" },
      { name: "Make centerpieces", timeframe: "3-months" },
      { name: "Create wedding favors", timeframe: "2-months" },
      { name: "Make table numbers/place cards", timeframe: "1-month" },
      { name: "Create ceremony programs", timeframe: "1-month" },
      { name: "Design and create signage", timeframe: "2-months" },
      { name: "Make photo booth props", timeframe: "1-month" },
      { name: "Create guest book alternative", timeframe: "2-months" },
      { name: "Assemble welcome bags", timeframe: "2-weeks" },
      { name: "Create wedding playlist", timeframe: "1-month" },
      { name: "Test DIY hair and makeup", timeframe: "2-months" },
    ],
  },
  {
    id: "cultural-wedding",
    name: "Cultural Wedding Elements",
    description:
      "Tasks for incorporating cultural traditions into your wedding",
    tasks: [
      { name: "Research cultural traditions", timeframe: "12-months" },
      { name: "Consult with family elders", timeframe: "10-months" },
      { name: "Find cultural attire", timeframe: "8-months" },
      { name: "Book cultural performers/musicians", timeframe: "6-months" },
      { name: "Order special ceremonial items", timeframe: "4-months" },
      { name: "Arrange for traditional food", timeframe: "6-months" },
      { name: "Brief officiant on cultural elements", timeframe: "3-months" },
      { name: "Create program explaining traditions", timeframe: "2-months" },
      { name: "Practice cultural dances/rituals", timeframe: "3-months" },
      { name: "Arrange for cultural decorations", timeframe: "4-months" },
    ],
  },
  {
    id: "post-wedding",
    name: "Post-Wedding Tasks",
    description: "Don't forget these important tasks after your wedding day",
    tasks: [
      { name: "Return rented items", timeframe: "1-week" },
      { name: "Send thank you cards", timeframe: "1-month" },
      { name: "Preserve wedding dress/attire", timeframe: "1-month" },
      { name: "Change name (if applicable)", timeframe: "1-month" },
      { name: "Update accounts with new name", timeframe: "1-month" },
      { name: "Review vendors", timeframe: "1-month" },
      { name: "Create wedding album", timeframe: "3-months" },
      {
        name: "Submit photos to publications (if desired)",
        timeframe: "3-months",
      },
      { name: "Merge finances (if applicable)", timeframe: "1-month" },
      { name: "Update beneficiaries", timeframe: "1-month" },
      { name: "Update will/estate planning", timeframe: "3-months" },
    ],
  },
];
