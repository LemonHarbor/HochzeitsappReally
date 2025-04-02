import { Contract } from "../types/contract";
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "ContractManagementDemo",
  
  setup() {
    // Sample contract data
    const sampleContracts = ref<Contract[]>([
      {
        id: "contract-1",
        vendor_id: "vendor-1",
        name: "Venue Rental Agreement",
        file_url: "https://example.com/contracts/venue-agreement.pdf",
        file_type: "application/pdf",
        file_size: 2500000,
        signed_date: new Date(2024, 5, 15).toISOString(),
        expiration_date: new Date(2025, 5, 15).toISOString(),
        status: "active",
        key_terms: {
          "Rental Fee": "$5,000",
          Deposit: "$1,000",
          "Cancellation Policy": "60 days notice required",
        },
        notes: "Main venue contract for the wedding ceremony and reception.",
        created_at: new Date(2024, 5, 10).toISOString(),
      },
      {
        id: "contract-2",
        vendor_id: "vendor-1",
        name: "Catering Service Agreement",
        file_url: "https://example.com/contracts/catering-agreement.pdf",
        file_type: "application/pdf",
        file_size: 1800000,
        signed_date: new Date(2024, 6, 1).toISOString(),
        expiration_date: new Date(
          new Date().getTime() + 15 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 15 days from now
        status: "active",
        key_terms: {
          "Cost Per Person": "$85",
          "Minimum Guests": "100",
          "Menu Selection Deadline": "30 days before event",
        },
        notes:
          "Catering contract including appetizers, main course, and dessert.",
        created_at: new Date(2024, 6, 1).toISOString(),
      },
      {
        id: "contract-3",
        vendor_id: "vendor-1",
        name: "Photography Contract",
        file_url: "https://example.com/contracts/photography-contract.pdf",
        file_type: "application/pdf",
        file_size: 1200000,
        signed_date: new Date(2024, 6, 15).toISOString(),
        expiration_date: new Date(2025, 0, 15).toISOString(),
        status: "pending",
        key_terms: {
          "Package Price": "$3,500",
          "Hours of Coverage": "8 hours",
          "Delivery Timeline": "6-8 weeks after event",
        },
        created_at: new Date(2024, 6, 15).toISOString(),
      },
      {
        id: "contract-4",
        vendor_id: "vendor-1",
        name: "DJ Services Agreement",
        file_url: "https://example.com/contracts/dj-agreement.docx",
        file_type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        file_size: 950000,
        status: "draft",
        created_at: new Date(2024, 7, 1).toISOString(),
      },
    ]);

    // Aktiver Tab
    const activeTab = ref("contracts");

    // Methoden für Event-Handling
    const handleViewContract = (url: string | undefined) => {
      if (url) {
        window.open(url, "_blank");
      }
    };

    const handleFormSubmit = (data: any) => {
      console.log("Form submitted:", data);
    };

    const handleFormCancel = () => {
      console.log("Form cancelled");
      activeTab.value = "contracts";
    };

    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };

    return {
      sampleContracts,
      activeTab,
      handleViewContract,
      handleFormSubmit,
      handleFormCancel,
      setActiveTab
    };
  },
  
  // WeWeb-spezifische Konfiguration
  wwElement: {
    type: 'contract-management-demo',
    uiSchema: {}
  },
  
  wwConfig: {
    general: {
      label: 'Vertragsverwaltung Demo',
      icon: 'file-text'
    }
  }
});
