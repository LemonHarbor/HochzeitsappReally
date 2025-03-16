import React from "react";
import GuestManagementPreview from "../guest/GuestManagementPreview";
import TablePlannerPreview from "../table/TablePlannerPreview";

interface PreviewSectionProps {
  onViewAllGuests: () => void;
  onAddGuest: () => void;
  onGuestClick: (guestId: string) => void;
  onViewFullPlanner: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  onViewAllGuests,
  onAddGuest,
  onGuestClick,
  onViewFullPlanner,
}) => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GuestManagementPreview
          onViewAll={onViewAllGuests}
          onAddGuest={onAddGuest}
          onGuestClick={onGuestClick}
        />

        <TablePlannerPreview onViewFullPlanner={onViewFullPlanner} />
      </div>
    </section>
  );
};
