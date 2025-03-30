import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select";
import { updateVendor } from "../../../../src/services/vendorService";
import { useToast } from "../../../../src/components/ui/use-toast";
import { Vendor } from "../../../../src/types/vendor";

interface VendorStatusSelectProps {
  vendor: Vendor;
  onStatusChange?: (newStatus: string) => void;
  className?: string;
}

const VendorStatusSelect: React.FC<VendorStatusSelectProps> = ({
  vendor,
  onStatusChange,
  className = "",
}) => {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Update vendor status in the database
      await updateVendor(vendor.id, {
        status: newStatus as "active" | "pending" | "inactive",
      });

      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(newStatus);
      }

      toast({
        title: "Status Updated",
        description: `Vendor status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update vendor status: ${error.message}`,
      });
    }
  };

  return (
    <Select
      defaultValue={vendor.status}
      onValueChange={handleStatusChange}
      className={className}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default VendorStatusSelect;
