import React from "react";
import { Vendor } from "@/types/vendor";
import ReviewReminder from "../timeline/ReviewReminder";
import VendorRecommendations from "../vendor/VendorRecommendations";
import UpcomingAppointments from "../dashboard/UpcomingAppointments";

interface VendorSectionProps {
  vendors: Vendor[] | undefined;
  onReviewVendor: (vendor: Vendor) => void;
  onNavigate: (path: string) => void;
}

export const VendorSection: React.FC<VendorSectionProps> = ({
  vendors,
  onReviewVendor,
  onNavigate,
}) => {
  if (!vendors || vendors.length === 0) return null;

  return (
    <section className="w-full">
      <ReviewReminder vendors={vendors} onReviewVendor={onReviewVendor} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
        <UpcomingAppointments
          vendors={vendors}
          onViewAppointment={(appointment) =>
            onNavigate(`/vendor-management?vendorId=${appointment.vendor_id}`)
          }
          onViewAllAppointments={() => onNavigate("/vendor-management")}
          onAddAppointment={() =>
            onNavigate("/vendor-management?section=appointments")
          }
        />

        <VendorRecommendations
          onViewVendorDetail={(vendor) =>
            onNavigate(`/vendor-management?vendorId=${vendor.id}`)
          }
        />
      </div>
    </section>
  );
};
