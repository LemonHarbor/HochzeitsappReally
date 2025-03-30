import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "../../../../src/lib/language";

const LanguageSwitcherDemo = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("app.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>{t("app.description")}</span>
            <div className="flex space-x-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
              >
                <Globe className="h-4 w-4 mr-2" />
                English
              </Button>
              <Button
                variant={language === "de" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("de")}
              >
                <Globe className="h-4 w-4 mr-2" />
                Deutsch
              </Button>
            </div>
          </div>

          <div className="space-y-2 border p-4 rounded-md">
            <h3 className="font-medium">{t("guests.title")}:</h3>
            <ul className="space-y-1">
              <li>- {t("guests.addGuest")}</li>
              <li>- {t("guests.editGuest")}</li>
              <li>- {t("guests.search")}</li>
            </ul>
          </div>

          <div className="space-y-2 border p-4 rounded-md">
            <h3 className="font-medium">{t("tables.title")}:</h3>
            <ul className="space-y-1">
              <li>- {t("tables.addTable")}</li>
              <li>- {t("tables.saveArrangement")}</li>
              <li>- {t("tables.aiOptimize")}</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline">{t("actions.cancel")}</Button>
            <Button>{t("actions.save")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSwitcherDemo;
