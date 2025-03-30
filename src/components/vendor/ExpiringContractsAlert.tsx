import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getExpiringContracts } from "@/services/contractService";
import { Contract } from "@/types/contract";

interface ExpiringContractsAlertProps {
  onViewContract?: (url: string) => void;
  onDismiss?: () => void;
  daysThreshold?: number;
}

const ExpiringContractsAlert: React.FC<ExpiringContractsAlertProps> = ({
  onViewContract = () => {},
  onDismiss = () => {},
  daysThreshold = 30,
}) => {
  const [expiringContracts, setExpiringContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchExpiringContracts = async () => {
      try {
        setLoading(true);
        const contracts = await getExpiringContracts(daysThreshold);
        setExpiringContracts(contracts);
      } catch (error) {
        console.error("Error fetching expiring contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpiringContracts();
  }, [daysThreshold]);

  // Format date
  const formatDateString = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expirationDate: string) => {
    const now = new Date();
    const expiration = parseISO(expirationDate);
    const diffTime = Math.abs(expiration.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  if (dismissed || loading || expiringContracts.length === 0) {
    return null;
  }

  return (
    <Card className="border-warning bg-warning/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-warning mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">
                {expiringContracts.length} contract
                {expiringContracts.length !== 1 ? "s" : ""} expiring soon
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                The following contracts will expire within {daysThreshold} days
              </p>
              <div className="space-y-2">
                {expiringContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-background rounded-md border"
                  >
                    <div>
                      <div className="font-medium">{contract.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Expires: {formatDateString(contract.expiration_date!)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {getDaysUntilExpiration(contract.expiration_date!)} days
                        left
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2"
                        onClick={() => onViewContract(contract.file_url)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiringContractsAlert;
