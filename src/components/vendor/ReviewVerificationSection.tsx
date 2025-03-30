import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VerificationBadge, { VerificationType } from "./VerificationBadge";
import { useLanguage } from "@/lib/language";

interface ReviewVerificationSectionProps {
  className?: string;
}

export function ReviewVerificationSection({
  className = "",
}: ReviewVerificationSectionProps) {
  const { language } = useLanguage();

  const verificationTypes: VerificationType[] = [
    "booking",
    "contract",
    "purchase",
    "admin",
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {language === "de" ? "Verifizierte Bewertungen" : "Verified Reviews"}
        </CardTitle>
        <CardDescription>
          {language === "de"
            ? "Bewertungen können auf verschiedene Weise verifiziert werden"
            : "Reviews can be verified in different ways"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {verificationTypes.map((type) => (
            <div key={type} className="flex items-start gap-3">
              <VerificationBadge type={type} showLabel={true} />
              <div className="text-sm">
                {type === "booking" &&
                  (language === "de"
                    ? "Der Gast hat nachweislich einen Termin mit diesem Dienstleister gebucht."
                    : "The guest has demonstrably booked an appointment with this vendor.")}
                {type === "contract" &&
                  (language === "de"
                    ? "Der Kunde hat einen Vertrag mit diesem Dienstleister abgeschlossen."
                    : "The customer has signed a contract with this vendor.")}
                {type === "purchase" &&
                  (language === "de"
                    ? "Der Kunde hat Produkte oder Dienstleistungen von diesem Anbieter gekauft."
                    : "The customer has purchased products or services from this vendor.")}
                {type === "admin" &&
                  (language === "de"
                    ? "Diese Bewertung wurde von einem Administrator überprüft und bestätigt."
                    : "This review has been checked and verified by an administrator.")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
