import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { useLanguage } from "@/lib/language";
import { useRealTimeRSVPStats } from "@/hooks/useRealtimeUpdates";
import { useRealtimeVendors } from "@/hooks/useRealtimeVendors";
import { Vendor } from "@/types/vendor";
import { DashboardHeader } from "./home/DashboardHeader";
import { DashboardStats } from "./home/DashboardStats";
import { DashboardActions } from "./home/DashboardActions";
import { VendorSection } from "./home/VendorSection";
import { PreviewSection } from "./home/PreviewSection";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { stats } = useRealTimeRSVPStats();
  const { vendors } = useRealtimeVendors();

  const handleViewAllGuests = () => {
    navigate("/guest-management");
  };

  const handleAddGuest = () => {
    console.log("Open add guest form");
  };

  const handleGuestClick = (guestId: string) => {
    console.log("Open guest details for:", guestId);
  };

  const handleViewFullPlanner = () => {
    navigate("/table-planner");
  };

  const handleReviewVendor = (vendor: Vendor) => {
    navigate(`/vendor-management?vendorId=${vendor.id}&section=reviews`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <DashboardHeader title={t("dashboard.title")} />

        <DashboardStats stats={stats} />

        <DashboardActions />

        <VendorSection
          vendors={vendors}
          onReviewVendor={handleReviewVendor}
          onNavigate={navigate}
        />

        <PreviewSection
          onViewAllGuests={handleViewAllGuests}
          onAddGuest={handleAddGuest}
          onGuestClick={handleGuestClick}
          onViewFullPlanner={handleViewFullPlanner}
        />
      </div>
    </Layout>
  );
};

export default Home;
