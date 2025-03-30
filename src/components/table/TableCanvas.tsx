import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  PlusCircle,
  Trash2,
  RotateCw,
  Save,
  ZoomIn,
  ZoomOut,
  Loader2,
} from "lucide-react";
import { Button } from "../../../../src/components/ui/button";
import { Card, CardContent } from "../../../../src/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/components/ui/tooltip";
import { cn } from "../../../../src/lib/utils";
import { updateTablePosition } from "../../../../src/services/tableService";
import { useToast } from "../../../../src/components/ui/use-toast";
import { useAuth } from "../../../../src/context/AuthContext";
import { useLanguage } from "../../../../src/lib/language";

interface Guest {
  id: string;
  name: string;
  category?: string;
  dietaryRestrictions?: string;
  rsvpStatus?: "confirmed" | "pending" | "declined";
}

interface Seat {
  id: string;
  guestId?: string;
  position: { x: number; y: number };
}

interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle" | "custom";
  seats: Seat[];
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
}

interface TableCanvasProps {
  tables?: Table[];
  loading?: boolean;
  onTableSelect?: (tableId: string | null) => void;
  selectedTableId?: string | null;
  onAssignGuest?: (seatId: string, guestId: string) => Promise<any>;
  selectedGroup?: {
    id: string;
    name: string;
    color: string;
    type: string;
  } | null;
}

const TableCanvasContent = ({
  tables = [],
  loading = false,
  onTableSelect = () => {},
  selectedTableId = null,
  onAssignGuest = async () => {},
  selectedGroup = null,
}: TableCanvasProps) => {
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const permissions = auth?.permissions || {
    canEditTables: false,
    canViewTables: false,
  };
  const { t } = useLanguage();

  // Set up drop target for the canvas
  const [, drop] = useDrop({
    accept: "GUEST",
    drop: (item: any, monitor) => {
      // Handle dropping on the canvas (not on a specific seat)
      return { didDrop: false };
    },
  });

  const handleTableSelect = (tableId: string) => {
    onTableSelect(tableId === selectedTableId ? null : tableId);
  };

  const handleTableDrag = useCallback(
    async (tableId: string, newPosition: { x: number; y: number }) => {
      if (!permissions.canEditTables) {
        toast({
          variant: "destructive",
          title: t("misc.error"),
          description: t("misc.error") + ": " + t("tables.title"),
        });
        return;
      }

      try {
        setIsSaving(true);
        // Update the table position in the database
        const table = tables.find((t) => t.id === tableId);
        if (table) {
          console.log("Updating table position:", {
            tableId,
            newPosition,
            rotation: table.rotation || 0,
          });
          await updateTablePosition(tableId, newPosition, table.rotation || 0);
        }
      } catch (error) {
        console.error("Error in handleTableDrag:", error);
        toast({
          variant: "destructive",
          title: t("misc.error"),
          description: error.message,
        });
      } finally {
        setIsSaving(false);
      }
    },
    [tables, permissions.canEditTables, toast, t],
  );

  const handleTableRotate = async (tableId: string) => {
    if (!permissions.canEditTables) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: t("misc.error") + ": " + t("actions.rotate"),
      });
      return;
    }

    try {
      setIsSaving(true);
      // Get the current table
      const table = tables.find((t) => t.id === tableId);
      if (table) {
        // Calculate new rotation
        const newRotation = ((table.rotation || 0) + 45) % 360;
        // Update the table rotation in the database
        await updateTablePosition(tableId, table.position, newRotation);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleDeleteTable = (tableId: string) => {
    // This is handled in the parent component (TablePlanner)
    // We just need to notify the parent that a table was selected for deletion
    if (selectedTableId === tableId) {
      onTableSelect(null);
    }
  };

  // Handle dropping a guest onto a seat
  const handleGuestDrop = async (guestId: string, seatId: string) => {
    if (!permissions.canEditTables) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: t("misc.error") + ": " + t("guests.title"),
      });
      return;
    }

    try {
      setIsSaving(true);
      // Assign the guest to the seat in the database
      await onAssignGuest(seatId, guestId);
      toast({
        title: t("misc.success"),
        description: t("misc.success") + ": " + t("guests.title"),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("misc.error"),
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-muted/20 rounded-lg border">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{t("misc.loading")}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden border">
      {/* Canvas controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("actions.zoomIn")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("actions.zoomOut")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Canvas area */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className="w-full h-full relative overflow-auto"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
        onClick={() => onTableSelect(null)}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          try {
            const dataStr = e.dataTransfer.getData("text/plain");
            if (!dataStr) return;

            const data = JSON.parse(dataStr);
            if (data.tableId) {
              const rect = e.currentTarget.getBoundingClientRect();
              const newX = (e.clientX - rect.left - data.offsetX) / zoom;
              const newY = (e.clientY - rect.top - data.offsetY) / zoom;
              console.log("Dropping table at position:", { x: newX, y: newY });
              handleTableDrag(data.tableId, { x: newX, y: newY });
            }
          } catch (error) {
            console.error("Error parsing drag data:", error);
          }
        }}
      >
        <div className="absolute inset-0 min-w-[2000px] min-h-[1500px] bg-grid-pattern">
          {tables.map((table) => {
            const isSelected = table.id === selectedTableId;

            return (
              <div
                key={table.id}
                className={cn(
                  "absolute cursor-move transition-transform",
                  isSelected ? "ring-2 ring-primary" : "",
                )}
                style={{
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                  transform: `rotate(${table.rotation}deg) scale(${zoom})`,
                  transformOrigin: "center center",
                  zIndex: isSelected ? 10 : 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTableSelect(table.id);
                }}
                draggable={true}
                onDragStart={(e) => {
                  // Store the initial mouse position relative to the table
                  const rect = e.currentTarget.getBoundingClientRect();
                  const offsetX = e.clientX - rect.left;
                  const offsetY = e.clientY - rect.top;
                  e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({
                      tableId: table.id,
                      offsetX,
                      offsetY,
                    }),
                  );
                  setIsDragging(true);
                  setDraggedTable(table.id);
                }}
                onDragEnd={() => {
                  setIsDragging(false);
                  setDraggedTable(null);
                }}
              >
                <Card
                  className={cn(
                    "overflow-hidden",
                    table.shape === "round" ? "rounded-full" : "rounded-lg",
                    isSelected ? "border-primary" : "",
                  )}
                  style={{
                    width: `${table.dimensions.width}px`,
                    height: `${table.dimensions.height}px`,
                    backgroundColor: isSelected
                      ? "rgba(var(--primary-rgb), 0.1)"
                      : table.group_id && table.group_id === selectedGroup?.id
                        ? `${selectedGroup.color}33` // Add 33 for 20% opacity
                        : table.group_id
                          ? "rgba(var(--muted-rgb), 0.2)"
                          : "var(--card-background)",
                    borderColor: table.group_id
                      ? table.group_id === selectedGroup?.id
                        ? selectedGroup.color
                        : "var(--border)"
                      : undefined,
                  }}
                >
                  <CardContent className="p-2 h-full flex flex-col justify-center items-center">
                    <div className="font-medium text-center">{table.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {table.seats.length} {t("tables.seats")}
                    </div>
                    {table.group_id && (
                      <div
                        className="mt-1 px-2 py-0.5 text-xs rounded-full"
                        style={{
                          backgroundColor:
                            selectedGroup?.id === table.group_id
                              ? selectedGroup.color
                              : "var(--muted)",
                          color:
                            selectedGroup?.id === table.group_id
                              ? "white"
                              : undefined,
                        }}
                      >
                        {/* Display group name if available */}
                        {table.group_name || "Group"}
                      </div>
                    )}

                    {/* Render seats */}
                    {table.seats.map((seat, index) => {
                      const angle = (360 / table.seats.length) * index;
                      const radius =
                        table.shape === "round"
                          ? Math.min(
                              table.dimensions.width,
                              table.dimensions.height,
                            ) / 2.5
                          : 0;

                      // Calculate position based on table shape
                      let seatStyle: React.CSSProperties = {};

                      if (table.shape === "round") {
                        const radian = (angle * Math.PI) / 180;
                        const centerX = table.dimensions.width / 2;
                        const centerY = table.dimensions.height / 2;

                        seatStyle = {
                          position: "absolute",
                          left: centerX + radius * Math.cos(radian) - 15,
                          top: centerY + radius * Math.sin(radian) - 15,
                        };
                      } else if (table.shape === "rectangle") {
                        // For rectangle tables, position seats around the perimeter
                        const seatCount = table.seats.length;
                        const seatsPerSide = Math.ceil(seatCount / 4);
                        const sideIndex = Math.floor(index / seatsPerSide);
                        const positionInSide = index % seatsPerSide;

                        const width = table.dimensions.width;
                        const height = table.dimensions.height;

                        switch (sideIndex) {
                          case 0: // Top side
                            seatStyle = {
                              position: "absolute",
                              left:
                                (width / (seatsPerSide + 1)) *
                                  (positionInSide + 1) -
                                15,
                              top: -15,
                            };
                            break;
                          case 1: // Right side
                            seatStyle = {
                              position: "absolute",
                              left: width - 15,
                              top:
                                (height / (seatsPerSide + 1)) *
                                  (positionInSide + 1) -
                                15,
                            };
                            break;
                          case 2: // Bottom side
                            seatStyle = {
                              position: "absolute",
                              left:
                                width -
                                (width / (seatsPerSide + 1)) *
                                  (positionInSide + 1) -
                                15,
                              top: height - 15,
                            };
                            break;
                          case 3: // Left side
                            seatStyle = {
                              position: "absolute",
                              left: -15,
                              top:
                                height -
                                (height / (seatsPerSide + 1)) *
                                  (positionInSide + 1) -
                                15,
                            };
                            break;
                        }
                      }

                      return (
                        <SeatDropTarget
                          key={seat.id}
                          seat={seat}
                          seatStyle={seatStyle}
                          index={index}
                          canEdit={permissions.canEditTables}
                          onGuestDrop={(guestId) =>
                            handleGuestDrop(guestId, seat.id)
                          }
                        >
                          {seat.guestId ? (
                            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              {seat.guestId.substring(0, 2)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {index + 1}
                            </span>
                          )}
                        </SeatDropTarget>
                      );
                    })}
                  </CardContent>
                </Card>

                {isSelected && (
                  <div className="absolute -top-4 -right-4 flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTableRotate(table.id);
                            }}
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("actions.rotate")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTable(table.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("actions.deleteTable")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Placeholder message when no tables */}
      {tables.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <p className="mb-4">{t("tables.noTables")}</p>
          <Button variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("tables.addFirstTable")}
          </Button>
        </div>
      )}
    </div>
  );
};

// Seat component with drop target functionality
interface SeatDropTargetProps {
  seat: Seat;
  seatStyle: React.CSSProperties;
  index: number;
  canEdit: boolean;
  onGuestDrop: (guestId: string) => void;
  children: React.ReactNode;
}

const SeatDropTarget: React.FC<SeatDropTargetProps> = ({
  seat,
  seatStyle,
  index,
  canEdit,
  onGuestDrop,
  children,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "GUEST",
    drop: (item: any) => {
      onGuestDrop(item.id);
      return { didDrop: true };
    },
    canDrop: () => !seat.guestId && canEdit,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;
  const seatClass = cn(
    "w-8 h-8 rounded-full flex items-center justify-center text-xs",
    {
      "bg-secondary": !seat.guestId && !isActive,
      "bg-secondary/80 cursor-pointer": !seat.guestId && canEdit && !isActive,
      "bg-primary/50": isActive,
      "cursor-not-allowed": seat.guestId || !canEdit,
    },
  );

  return (
    <div ref={drop} className={seatClass} style={seatStyle}>
      {children}
    </div>
  );
};

// Wrapper component that ensures DndProvider is available
const TableCanvas = (props: TableCanvasProps) => {
  // Check if we're already inside a DndProvider context
  let isDndProviderAvailable = false;
  try {
    // This will throw if not in a DndProvider context
    useDrop(() => ({ accept: [] }));
    isDndProviderAvailable = true;
  } catch (e) {
    isDndProviderAvailable = false;
  }

  if (isDndProviderAvailable) {
    return <TableCanvasContent {...props} />;
  }

  // If not in a DndProvider context, wrap with one
  return (
    <DndProvider backend={HTML5Backend}>
      <TableCanvasContent {...props} />
    </DndProvider>
  );
};

export default TableCanvas;
