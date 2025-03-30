import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRealtimeVendors } from "@/hooks/useRealtimeVendors";
import {
  createVendor,
  updateVendor,
  deleteVendor,
  getExpensesByVendor,
} from "@/services/vendorService";
import { Vendor } from "@/types/vendor";
import VendorList from "./VendorList";
import VendorForm from "./VendorForm";
import VendorExpenses from "./VendorExpenses";
import VendorExpenseReport from "./VendorExpenseReport";
import VendorDetail from "./VendorDetail";
import VendorPayments from "./VendorPayments";
import VendorContracts from "./VendorContracts";
import VendorReviews from "./VendorReviews";
import VendorAppointments from "./VendorAppointments";
import VendorComparisonTool from "./VendorComparisonTool";
import VendorRecommendations from "./VendorRecommendations";
import ExpiringContractsAlert from "./ExpiringContractsAlert";
import { updateExpense } from "@/services/budgetService";

interface VendorManagerProps {
  onAddExpense?: (vendorId: string) => void;
  onViewReceipt?: (url: string) => void;
  initialVendorId?: string;
}

const VendorManager: React.FC<VendorManagerProps> = ({
  onAddExpense,
  onViewReceipt = () => {},
  initialVendorId,
}) => {
  const { toast } = useToast();
  const { vendors, loading } = useRealtimeVendors();
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewingVendorExpenses, setViewingVendorExpenses] = useState(false);
  const [viewingDetailedReport, setViewingDetailedReport] = useState(false);
  const [viewingVendorDetail, setViewingVendorDetail] = useState(false);
  const [viewingVendorPayments, setViewingVendorPayments] = useState(false);
  const [viewingVendorContracts, setViewingVendorContracts] = useState(false);
  const [viewingVendorReviews, setViewingVendorReviews] = useState(false);
  const [viewingVendorAppointments, setViewingVendorAppointments] =
    useState(false);
  const [viewingVendorComparison, setViewingVendorComparison] = useState(false);
  const [viewingVendorRecommendations, setViewingVendorRecommendations] =
    useState(false);

  // Handle adding a new vendor
  const handleAddVendor = () => {
    setIsEditing(false);
    setSelectedVendor(null);
    setShowVendorForm(true);
  };

  // Handle editing a vendor
  const handleEditVendor = (vendor: Vendor) => {
    setIsEditing(true);
    setSelectedVendor(vendor);
    setShowVendorForm(true);
  };

  // Handle deleting a vendor
  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteVendor(id);
      toast({
        title: "Vendor Deleted",
        description: "The vendor has been deleted successfully.",
      });
      // Reset view if the deleted vendor was being viewed
      if (selectedVendor?.id === id) {
        setViewingVendorDetail(false);
        setViewingVendorExpenses(false);
        setViewingDetailedReport(false);
        setViewingVendorRecommendations(false);
        setSelectedVendor(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete vendor: ${error.message}`,
      });
    }
  };

  // Handle vendor form submission
  const handleVendorFormSubmit = async (data: any) => {
    try {
      if (isEditing && selectedVendor) {
        // Update existing vendor
        await updateVendor(selectedVendor.id, data);
        toast({
          title: "Vendor Updated",
          description: "The vendor has been updated successfully.",
        });
      } else {
        // Add new vendor
        await createVendor(data);
        toast({
          title: "Vendor Added",
          description: "The new vendor has been added successfully.",
        });
      }

      setShowVendorForm(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} vendor: ${error.message}`,
      });
    }
  };

  // Handle viewing vendor details
  const handleViewVendorDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewingVendorDetail(true);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
  };

  // Handle viewing vendor expenses
  const handleViewExpenses = async (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setViewingVendorExpenses(true);
    setViewingVendorDetail(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
  };

  // Handle viewing detailed expense report
  const handleViewDetailedReport = (vendor: Vendor) => {
    setViewingDetailedReport(true);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingVendorPayments(false);
  };

  // Handle adding an expense for a specific vendor
  const handleAddExpenseForVendor = () => {
    if (selectedVendor && onAddExpense) {
      onAddExpense(selectedVendor.id);
      setViewingVendorExpenses(false);
      setViewingVendorDetail(false);
      setViewingDetailedReport(false);
      setViewingVendorPayments(false);
    }
  };

  // Handle viewing payment schedule
  const handleViewPayments = () => {
    setViewingVendorPayments(true);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorContracts(false);
  };

  // Handle viewing contracts
  const handleViewContracts = () => {
    setViewingVendorContracts(true);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
    setViewingVendorReviews(false);
  };

  // Handle viewing reviews
  const handleViewReviews = () => {
    setViewingVendorReviews(true);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
    setViewingVendorContracts(false);
    setViewingVendorAppointments(false);
  };

  // Handle viewing appointments
  const handleViewAppointments = () => {
    setViewingVendorAppointments(true);
    setViewingVendorReviews(false);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
    setViewingVendorContracts(false);
  };

  // Handle back from detailed report
  const handleBackFromReport = () => {
    setViewingDetailedReport(false);
    setViewingVendorExpenses(true);
  };

  // Handle back from vendor detail
  const handleBackFromDetail = () => {
    setViewingVendorDetail(false);
  };

  // Handle back from reviews
  const handleBackFromReviews = () => {
    setViewingVendorReviews(false);
  };

  // Handle viewing a contract file
  const handleViewContract = (url: string) => {
    window.open(url, "_blank");
  };

  // Handle comparing vendors
  const handleCompareVendors = () => {
    setViewingVendorComparison(true);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
    setViewingVendorContracts(false);
    setViewingVendorRecommendations(false);
  };

  // Handle viewing vendor recommendations
  const handleViewRecommendations = () => {
    setViewingVendorRecommendations(true);
    setViewingVendorComparison(false);
    setViewingVendorDetail(false);
    setViewingVendorExpenses(false);
    setViewingDetailedReport(false);
    setViewingVendorPayments(false);
    setViewingVendorContracts(false);
    setViewingVendorReviews(false);
  };

  // Check for initial section from URL parameters
  useEffect(() => {
    if (window.initialSection === "recommendations") {
      setViewingVendorRecommendations(true);
      // Clear the global variable after using it
      window.initialSection = undefined;
    }
  }, []);

  // Set selected vendor from initialVendorId
  useEffect(() => {
    if (initialVendorId && vendors.length > 0) {
      const vendor = vendors.find((v) => v.id === initialVendorId);
      if (vendor) {
        setSelectedVendor(vendor);
        setViewingVendorDetail(true);
      }
    }
  }, [initialVendorId, vendors]);

  return (
    <div>
      <ExpiringContractsAlert onViewContract={handleViewContract} />

      {viewingDetailedReport && selectedVendor ? (
        <VendorExpenseReport
          vendor={selectedVendor}
          onBack={handleBackFromReport}
          onAddExpense={onAddExpense ? handleAddExpenseForVendor : undefined}
          onViewReceipt={onViewReceipt}
        />
      ) : viewingVendorExpenses && selectedVendor ? (
        <VendorExpenses
          vendor={selectedVendor}
          onBack={() => setViewingVendorExpenses(false)}
          onAddExpense={onAddExpense ? handleAddExpenseForVendor : undefined}
          onViewReceipt={onViewReceipt}
          onViewDetailedReport={handleViewDetailedReport}
        />
      ) : viewingVendorPayments && selectedVendor ? (
        <VendorPayments
          vendor={selectedVendor}
          onBack={() => setViewingVendorPayments(false)}
        />
      ) : viewingVendorContracts && selectedVendor ? (
        <VendorContracts
          vendor={selectedVendor}
          onBack={() => setViewingVendorContracts(false)}
        />
      ) : viewingVendorReviews && selectedVendor ? (
        <VendorReviews vendor={selectedVendor} onBack={handleBackFromReviews} />
      ) : viewingVendorAppointments && selectedVendor ? (
        <VendorAppointments
          vendor={selectedVendor}
          onBack={() => setViewingVendorAppointments(false)}
        />
      ) : viewingVendorRecommendations ? (
        <VendorRecommendations
          selectedVendor={selectedVendor}
          onViewVendorDetail={handleViewVendorDetail}
        />
      ) : viewingVendorComparison ? (
        <VendorComparisonTool
          onBack={() => setViewingVendorComparison(false)}
          onViewVendorDetail={handleViewVendorDetail}
        />
      ) : viewingVendorDetail && selectedVendor ? (
        <VendorDetail
          vendor={selectedVendor}
          onBack={handleBackFromDetail}
          onEdit={handleEditVendor}
          onDelete={handleDeleteVendor}
          onAddExpense={onAddExpense ? handleAddExpenseForVendor : undefined}
          onViewExpenses={() => handleViewExpenses(selectedVendor)}
          onViewDetailedReport={() => handleViewDetailedReport(selectedVendor)}
          onViewPayments={handleViewPayments}
          onViewContracts={handleViewContracts}
          onViewReviews={handleViewReviews}
          onViewAppointments={handleViewAppointments}
          onViewReceipt={onViewReceipt}
        />
      ) : (
        <VendorList
          vendors={vendors}
          loading={loading}
          onAddVendor={handleAddVendor}
          onEditVendor={handleEditVendor}
          onDeleteVendor={handleDeleteVendor}
          onViewExpenses={handleViewExpenses}
          onViewVendorDetail={handleViewVendorDetail}
          onCompareVendors={handleCompareVendors}
        />
      )}

      {/* Vendor Form Dialog */}
      <Dialog open={showVendorForm} onOpenChange={setShowVendorForm}>
        <DialogContent className="sm:max-w-2xl">
          <VendorForm
            isEditing={isEditing}
            initialData={selectedVendor || {}}
            onSubmit={handleVendorFormSubmit}
            onCancel={() => setShowVendorForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorManager;
