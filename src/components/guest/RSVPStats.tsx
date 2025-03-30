import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

interface RSVPStatsProps {
  confirmedCount?: number;
  pendingCount?: number;
  declinedCount?: number;
  totalGuests?: number;
}

import { useRealTimeRSVPStats } from "@/hooks/useRealtimeUpdates";

const RSVPStats = ({
  confirmedCount,
  pendingCount,
  declinedCount,
  totalGuests,
}: RSVPStatsProps) => {
  // Use real-time stats if props are not provided
  const { stats, loading } = useRealTimeRSVPStats();

  // Use provided props or real-time stats
  const confirmed = confirmedCount ?? stats.confirmed;
  const pending = pendingCount ?? stats.pending;
  const declined = declinedCount ?? stats.declined;
  const total = totalGuests ?? stats.total;
  // Calculate percentages for progress bars
  const confirmedPercentage = Math.round((confirmed / (total || 1)) * 100);
  const pendingPercentage = Math.round((pending / (total || 1)) * 100);
  const declinedPercentage = Math.round((declined / (total || 1)) * 100);

  if (
    loading &&
    !confirmedCount &&
    !pendingCount &&
    !declinedCount &&
    !totalGuests
  ) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <h2 className="text-2xl font-bold mb-4">RSVP Statistics</h2>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Confirmed"
              count={confirmedCount}
              total={totalGuests}
              percentage={confirmedPercentage}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              progressColor="bg-green-500"
            />

            <StatCard
              title="Pending"
              count={pendingCount}
              total={totalGuests}
              percentage={pendingPercentage}
              icon={<HelpCircle className="h-5 w-5 text-amber-500" />}
              progressColor="bg-amber-500"
            />

            <StatCard
              title="Declined"
              count={declinedCount}
              total={totalGuests}
              percentage={declinedPercentage}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
              progressColor="bg-red-500"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Overall RSVP Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Responses: {confirmedCount + declinedCount}/
                  {totalGuests}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(
                    ((confirmedCount + declinedCount) / totalGuests) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.round(
                  ((confirmedCount + declinedCount) / totalGuests) * 100,
                )}
                className="h-2"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailCard
                title="Family"
                icon={<Users className="h-5 w-5" />}
                confirmed={18}
                pending={7}
                declined={5}
                total={30}
              />

              <DetailCard
                title="Friends"
                icon={<Users className="h-5 w-5" />}
                confirmed={20}
                pending={15}
                declined={5}
                total={40}
              />

              <DetailCard
                title="Colleagues"
                icon={<Users className="h-5 w-5" />}
                confirmed={7}
                pending={8}
                declined={5}
                total={20}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-gray-500 border border-dashed rounded-md">
                  Timeline chart placeholder
                  {/* In a real implementation, you would integrate a chart library like recharts or chart.js */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  total: number;
  percentage: number;
  icon: React.ReactNode;
  progressColor: string;
}

const StatCard = ({
  title,
  count,
  total,
  percentage,
  icon,
  progressColor,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {percentage}% of total guests
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {count}/{total}
            </span>
            <span className="text-xs font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className={`${progressColor} h-2 rounded-full`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DetailCardProps {
  title: string;
  icon: React.ReactNode;
  confirmed: number;
  pending: number;
  declined: number;
  total: number;
}

const DetailCard = ({
  title,
  icon,
  confirmed,
  pending,
  declined,
  total,
}: DetailCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Confirmed</span>
            </div>
            <span className="text-sm font-medium">{confirmed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm">Pending</span>
            </div>
            <span className="text-sm font-medium">{pending}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserX className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm">Declined</span>
            </div>
            <span className="text-sm font-medium">{declined}</span>
          </div>

          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-bold">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RSVPStats;
