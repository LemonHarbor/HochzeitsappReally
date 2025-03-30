import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Edit, Maximize2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Badge } from "../../../../src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/components/ui/tooltip";
import {
  useRealtimeTables,
  useRealtimeSeats,
} from "../../../../src/hooks/useRealtimeUpdates";
import { useLanguage } from "../../../../src/lib/language";

interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "custom";
  capacity: number;
  assignedGuests: number;
}

interface TablePlannerPreviewProps {
  tables?: Table[];
  onViewFullPlanner?: () => void;
}

const TablePlannerPreview = ({
  tables: propTables,
  onViewFullPlanner = () => {},
}: TablePlannerPreviewProps) => {
  const { t } = useLanguage();

  // Use realtime data if no tables are provided as props
  const { tables: realtimeTables, loading } = useRealtimeTables();
  const { seats } = useRealtimeSeats();

  // Process tables data
  const tables =
    propTables ||
    realtimeTables.map((table) => {
      // Count assigned guests for this table
      const tableSeats = seats.filter((seat) => seat.table_id === table.id);
      const assignedGuests = tableSeats.filter((seat) => seat.guest_id).length;

      return {
        id: table.id,
        name: table.name,
        shape: table.shape as "round" | "rectangle" | "custom",
        capacity: tableSeats.length,
        assignedGuests,
      };
    });

  // Calculate total stats
  const totalTables = tables.length;
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);
  const totalAssigned = tables.reduce(
    (sum, table) => sum + table.assignedGuests,
    0,
  );
  const assignedPercentage =
    totalCapacity > 0 ? Math.round((totalAssigned / totalCapacity) * 100) : 0;

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            {t("tables.title")}
          </CardTitle>
          <Link to="/table-planner">
            <Button variant="outline" size="sm" onClick={onViewFullPlanner}>
              <Maximize2 className="h-4 w-4 mr-2" />
              {t("actions.view")} {t("tables.title")}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center p-4 rounded-lg bg-muted/50">
            <div className="mr-4 bg-primary/10 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tables.title")}
              </p>
              <p className="text-2xl font-bold">{totalTables}</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-lg bg-muted/50">
            <div className="mr-4 bg-primary/10 p-2 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("guests.title")}
              </p>
              <p className="text-2xl font-bold">
                {totalAssigned}/{totalCapacity}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-lg bg-muted/50">
            <div className="mr-4 bg-primary/10 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("tables.capacity")}
              </p>
              <p className="text-2xl font-bold">{assignedPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg border h-[200px] bg-muted/20">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : tables.length > 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-6 px-4">
                {tables.slice(0, 3).map((table) => (
                  <TooltipProvider key={table.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative flex items-center justify-center ${table.shape === "round" ? "rounded-full" : "rounded-lg"} border-2 border-primary/50 bg-background shadow-sm cursor-pointer hover:border-primary transition-colors`}
                          style={{
                            width: table.shape === "round" ? "100px" : "120px",
                            height: table.shape === "round" ? "100px" : "80px",
                          }}
                        >
                          <div className="text-center">
                            <p className="font-medium text-sm">{table.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {table.assignedGuests}/{table.capacity}
                            </p>
                          </div>
                          <Badge
                            variant={
                              table.assignedGuests === table.capacity
                                ? "default"
                                : "secondary"
                            }
                            className="absolute -top-2 -right-2 text-xs"
                          >
                            {table.assignedGuests === table.capacity
                              ? "Full"
                              : "Open"}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{table.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {table.assignedGuests} of {table.capacity} seats
                          filled
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {tables.length > 3 && (
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 w-[100px] h-[100px]">
                    <p className="text-sm text-muted-foreground">
                      +{tables.length - 3} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">
                {t("tables.noTables")}
              </p>
              <Link to="/table-planner">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  {t("tables.addFirstTable")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Link to="/table-planner" className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onViewFullPlanner}
          >
            <span>{t("tables.saveArrangement")}</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TablePlannerPreview;
