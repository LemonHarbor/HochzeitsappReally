import React from "react";
import StatisticsOverview from "../dashboard/StatisticsOverview";

interface DashboardStatsProps {
  stats: {
    total: number;
    confirmed: number;
    pending: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <section className="w-full overflow-hidden">
      <StatisticsOverview
        totalGuests={stats.total}
        confirmedGuests={stats.confirmed}
        pendingRsvps={stats.pending}
        daysUntilWedding={45}
        tablesPlanned={12}
        giftsReceived={24}
      />
    </section>
  );
};
