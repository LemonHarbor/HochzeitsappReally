import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TableProperties, Users } from "lucide-react";
import { useLanguage } from "@/lib/language";

const TablePlannerDemo = () => {
  const { t } = useLanguage();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t("tables.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>
                {t("tables.title")} {t("app.description")}
              </span>
              <div className="flex space-x-2">
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("tables.addTable")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Table shapes */}
              <div className="border p-4 rounded-md flex flex-col items-center justify-center space-y-2">
                <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center">
                  <TableProperties className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{t("tables.round")}</p>
              </div>

              <div className="border p-4 rounded-md flex flex-col items-center justify-center space-y-2">
                <div className="w-24 h-16 rounded-md border-2 border-primary flex items-center justify-center">
                  <TableProperties className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{t("tables.rectangle")}</p>
              </div>

              <div className="border p-4 rounded-md flex flex-col items-center justify-center space-y-2">
                <div
                  className="w-20 h-20 border-2 border-primary flex items-center justify-center"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                >
                  <TableProperties className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">{t("tables.custom")}</p>
              </div>
            </div>

            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">{t("guests.title")}</h3>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 border rounded-md bg-background"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Guest {i}</p>
                      <p className="text-xs text-muted-foreground">
                        guest{i}@example.com
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline">{t("actions.cancel")}</Button>
              <Button>{t("tables.saveArrangement")}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
};

export default TablePlannerDemo;
