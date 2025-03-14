import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import StatisticsOverview from "./dashboard/StatisticsOverview";
import QuickActions from "./dashboard/QuickActions";
import GuestManagementPreview from "./guest/GuestManagementPreview";
import TablePlannerPreview from "./table/TablePlannerPreview";
import { useLanguage } from "@/lib/language";
import { useRealTimeRSVPStats } from "@/hooks/useRealtimeUpdates";
import ReviewReminder from "./timeline/ReviewReminder";
import { useRealtimeVendors } from "@/hooks/useRealtimeVendors";
import ReviewReminder from "./timeline/ReviewReminder";
import { useRealtimeVendors } from "@/hooks/useRealtimeVendors";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { stats } = useRealTimeRSVPStats();
  const { vendors } = useRealtimeVendors();
  const { vendors } = useRealtimeVendors();

  const handleViewAllGuests = () => {
    // Navigate to guest management page
    navigate("/guest-management");
  };

  const handleAddGuest = () => {
    // Open add guest form
    console.log("Open add guest form");
  };

  const handleGuestClick = (guestId: string) => {
    // Open guest details
    console.log("Open guest details for:", guestId);
  };

  const handleViewFullPlanner = () => {
    // Navigate to table planner page
    navigate("/table-planner");
  };

  const handleReviewVendor = (vendor) => {
    // Navigate to vendor detail page with review section open
    navigate(`/vendor-management?vendorId=${vendor.id}&section=reviews`);
  };

  const handleReviewVendor = (vendor) => {
    // Navigate to vendor detail page with review section open
    navigate(`/vendor-management?vendorId=${vendor.id}&section=reviews`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>

        {/* Statistics Overview */}
        <StatisticsOverview
          totalGuests={stats.total}
          confirmedGuests={stats.confirmed}
          pendingRsvps={stats.pending}
          daysUntilWedding={45}
          tablesPlanned={12}
          giftsReceived={24}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Vendor Review Reminder */}
        {vendors && vendors.length > 0 && (
          <ReviewReminder
            vendors={vendors}
            onReviewVendor={handleReviewVendor}
          />
        )}

        {/* Vendor Review Reminder */}
        {vendors && vendors.length > 0 && (
          <ReviewReminder
            vendors={vendors}
            onReviewVendor={handleReviewVendor}
          />
        )}

        {/* Preview Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Management Preview */}
          <GuestManagementPreview
            onViewAll={handleViewAllGuests}
            onAddGuest={handleAddGuest}
            onGuestClick={handleGuestClick}
          />

          {/* Table Planner Preview */}
          <TablePlannerPreview onViewFullPlanner={handleViewFullPlanner} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
