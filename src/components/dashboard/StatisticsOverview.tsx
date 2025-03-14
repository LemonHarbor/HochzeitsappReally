import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  TableProperties,
  Gift,
} from "lucide-react";
import { useRealTimeRSVPStats } from "@/hooks/useRealtimeUpdates";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && trendValue && (
          <div
            className={`flex items-center mt-2 text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"}`}
          >
            <span
              className={`mr-1 ${trend === "up" ? "rotate-0" : trend === "down" ? "rotate-180" : ""}`}
            >
              {trend !== "neutral" ? "↑" : "→"}
            </span>
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatisticsOverviewProps {
  totalGuests?: number;
  confirmedGuests?: number;
  pendingRsvps?: number;
  daysUntilWedding?: number;
  tablesPlanned?: number;
  giftsReceived?: number;
}

const StatisticsOverview = ({
  totalGuests,
  confirmedGuests,
  pendingRsvps,
  daysUntilWedding = 45,
  tablesPlanned = 12,
  giftsReceived = 24,
}: StatisticsOverviewProps) => {
  // Use real-time stats if props are not provided
  const { stats, loading } = useRealTimeRSVPStats();

  // Use provided props or real-time stats
  const total = totalGuests ?? stats.total;
  const confirmed = confirmedGuests ?? stats.confirmed;
  const pending = pendingRsvps ?? stats.pending;

  const confirmedPercentage = Math.round((confirmed / (total || 1)) * 100);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Wedding Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Guests"
          value={total}
          description={`${confirmed} confirmed`}
          icon={<Users className="h-4 w-4" />}
          trend="up"
          trendValue={`${confirmedPercentage}% confirmed`}
        />

        <StatCard
          title="Pending RSVPs"
          value={pending}
          description="Awaiting response"
          icon={<Clock className="h-4 w-4" />}
          trend="down"
          trendValue={`${Math.round((pending / (total || 1)) * 100)}% of total`}
        />

        <StatCard
          title="Days Until Wedding"
          value={daysUntilWedding}
          description={`${new Date().toLocaleDateString()} - ${new Date(Date.now() + daysUntilWedding * 86400000).toLocaleDateString()}`}
          icon={<CalendarDays className="h-4 w-4" />}
        />

        <StatCard
          title="Tables Planned"
          value={tablesPlanned}
          description="Seating arrangements"
          icon={<TableProperties className="h-4 w-4" />}
        />

        <StatCard
          title="Confirmed Guests"
          value={confirmed}
          description={`${confirmedPercentage}% of total guests`}
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
          trendValue="+12 this week"
        />

        <StatCard
          title="Gifts Received"
          value={giftsReceived}
          description="Thank you notes pending: 8"
          icon={<Gift className="h-4 w-4" />}
          trend="up"
          trendValue="+5 this week"
        />
      </div>
    </div>
  );
};

export default StatisticsOverview;
