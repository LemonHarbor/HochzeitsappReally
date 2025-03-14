import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TableCanvas from "@/components/table/TableCanvas";

const TableCanvasDemo = () => {
  // Sample table data
  const tables = [
    {
      id: "table-1",
      name: "Family Table",
      shape: "round",
      position: { x: 200, y: 200 },
      dimensions: { width: 200, height: 200 },
      rotation: 0,
      seats: [
        { id: "seat-1", position: { x: 0, y: 0 } },
        { id: "seat-2", position: { x: 0, y: 0 } },
        { id: "seat-3", position: { x: 0, y: 0 } },
        { id: "seat-4", position: { x: 0, y: 0 } },
        { id: "seat-5", position: { x: 0, y: 0 } },
        { id: "seat-6", position: { x: 0, y: 0 } },
      ],
    },
    {
      id: "table-2",
      name: "Friends Table",
      shape: "rectangle",
      position: { x: 500, y: 300 },
      dimensions: { width: 300, height: 150 },
      rotation: 0,
      seats: [
        { id: "seat-7", position: { x: 0, y: 0 } },
        { id: "seat-8", position: { x: 0, y: 0 } },
        { id: "seat-9", position: { x: 0, y: 0 } },
        { id: "seat-10", position: { x: 0, y: 0 } },
        { id: "seat-11", position: { x: 0, y: 0 } },
        { id: "seat-12", position: { x: 0, y: 0 } },
        { id: "seat-13", position: { x: 0, y: 0 } },
        { id: "seat-14", position: { x: 0, y: 0 } },
      ],
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-[600px] p-4">
        <TableCanvas
          tables={tables}
          loading={false}
          onTableSelect={() => {}}
          selectedTableId={null}
          onAssignGuest={async () => {}}
        />
      </div>
    </DndProvider>
  );
};

export default TableCanvasDemo;
