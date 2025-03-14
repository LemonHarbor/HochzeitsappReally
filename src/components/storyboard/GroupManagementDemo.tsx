import React from "react";
import GroupManagement from "@/components/table/GroupManagement";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";

const GroupManagementDemo = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background">
          <h1 className="text-2xl font-bold mb-6">Group Management Demo</h1>
          <div className="bg-muted/20 p-4 rounded-lg border">
            <GroupManagement
              onGroupSelect={(group) => {
                console.log("Selected group:", group);
              }}
            />
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default GroupManagementDemo;
