import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Contract } from "@/types/contract";
import { useRealtimeContracts } from "@/hooks/useRealtimeContracts";
import { useToast } from "@/components/ui/use-toast";
import ContractList from "./ContractList";
import ContractForm from "./ContractForm";
import ContractDetails from "./ContractDetails";
import {
  createContract,
  updateContract,
  deleteContract,
} from "@/services/contractService";

interface VendorContractsProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorContracts: React.FC<VendorContractsProps> = ({
  vendor,
  onBack,
}) => {
  const { toast } = useToast();
  const { contracts, loading } = useRealtimeContracts(vendor.id);
  const [showContractForm, setShowContractForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [viewingContractDetails, setViewingContractDetails] = useState(false);

  // Handle adding a new contract
  const handleAddContract = () => {
    setIsEditing(false);
    setSelectedContract(null);
    setShowContractForm(true);
  };

  // Handle editing a contract
  const handleEditContract = (contract: Contract) => {
    setIsEditing(true);
    setSelectedContract(contract);
    setShowContractForm(true);
  };

  // Handle deleting a contract
  const handleDeleteContract = async (id: string) => {
    try {
      await deleteContract(id);
      toast({
        title: "Contract Deleted",
        description: "The contract has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete contract: ${error.message}`,
      });
    }
  };

  // Handle contract form submission
  const handleContractFormSubmit = async (data: any, file: File) => {
    try {
      if (isEditing && selectedContract) {
        // Update existing contract
        await updateContract(selectedContract.id, data, file);
        toast({
          title: "Contract Updated",
          description: "The contract has been updated successfully.",
        });
      } else {
        // Add new contract
        await createContract(data, file);
        toast({
          title: "Contract Added",
          description: "The new contract has been added successfully.",
        });
      }

      setShowContractForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} contract: ${error.message}`,
      });
    }
  };

  // Handle viewing a contract
  const handleViewContract = (url: string) => {
    window.open(url, "_blank");
  };

  // Handle viewing contract details
  const handleViewContractDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setViewingContractDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          <p className="text-muted-foreground">Contracts & Agreements</p>
        </div>
      </div>

      {viewingContractDetails && selectedContract ? (
        <ContractDetails
          contract={selectedContract}
          onEdit={() => {
            setViewingContractDetails(false);
            handleEditContract(selectedContract);
          }}
          onViewContract={handleViewContract}
        />
      ) : (
        <ContractList
          contracts={contracts}
          loading={loading}
          onAddContract={handleAddContract}
          onEditContract={(contract) => {
            // If clicked on the contract name or details, view details
            handleViewContractDetails(contract);
          }}
          onDeleteContract={handleDeleteContract}
          onViewContract={handleViewContract}
        />
      )}

      {/* Contract Form Dialog */}
      <Dialog open={showContractForm} onOpenChange={setShowContractForm}>
        <DialogContent className="sm:max-w-2xl">
          <ContractForm
            vendorId={vendor.id}
            isEditing={isEditing}
            initialData={selectedContract || {}}
            onSubmit={handleContractFormSubmit}
            onCancel={() => setShowContractForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorContracts;
