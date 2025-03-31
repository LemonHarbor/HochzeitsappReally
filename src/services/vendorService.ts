import { supabase } from "../lib/supabase";
import { Vendor, VendorFormData } from "../types/vendor";

// Create a new vendor
export const createVendor = async (data: VendorFormData): Promise<Vendor> => {
  try {
    const { data: newVendor, error } = await supabase
      .from("vendors")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return newVendor;
  } catch (error) {
    console.error("Error creating vendor:", error);
    throw error;
  }
};

// Get all vendors
export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("name");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};

// Get vendor by ID
export const getVendorById = async (id: string): Promise<Vendor> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (
  id: string,
  data: Partial<VendorFormData>
): Promise<Vendor> => {
  try {
    const { data: updatedVendor, error } = await supabase
      .from("vendors")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updatedVendor;
  } catch (error) {
    console.error("Error updating vendor:", error);
    throw error;
  }
};

// Delete vendor
export const deleteVendor = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw error;
  }
};

// Get vendors by category
export const getVendorsByCategory = async (
  category: string
): Promise<Vendor[]> => {
  try {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("category", category)
      .order("name");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching vendors by category:", error);
    throw error;
  }
};

// Link vendor to expense
export const linkVendorToExpense = async (
  expenseId: string,
  vendorId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("expenses")
      .update({ vendor_id: vendorId })
      .eq("id", expenseId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error linking vendor to expense:", error);
    throw error;
  }
};

// Get expenses by vendor
export const getExpensesByVendor = async (vendorId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("date", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching expenses by vendor:", error);
    throw error;
  }
};

// Get all vendors with expense summaries
export const getVendorsWithExpenseSummaries = async (): Promise<any[]> => {
  try {
    // First get all vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from("vendors")
      .select("*")
      .order("name");
    if (vendorsError) throw vendorsError;
    // Then get all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .not("vendor_id", "is", null);
    if (expensesError) throw expensesError;
    // Calculate expense summaries for each vendor
    const vendorsWithSummaries = vendors.map((vendor) => {
      const vendorExpenses = expenses.filter(
        (expense) => expense.vendor_id === vendor.id
      );
      const totalExpenses = vendorExpenses
        .filter((expense) => expense.status !== "cancelled")
        .reduce((sum, expense) => sum + expense.amount, 0);
      const paidExpenses = vendorExpenses
        .filter((expense) => expense.status === "paid")
        .reduce((sum, expense) => sum + expense.amount, 0);
      const pendingExpenses = vendorExpenses
        .filter((expense) => expense.status === "pending")
        .reduce((sum, expense) => sum + expense.amount, 0);
      return {
        ...vendor,
        total_expenses: totalExpenses,
        paid_expenses: paidExpenses,
        pending_expenses: pendingExpenses,
      };
    });
    return vendorsWithSummaries;
  } catch (error) {
    console.error("Error fetching vendors with expense summaries:", error);
    throw error;
  }
};

// Get expense summary by vendor
export const getVendorExpenseSummary = async (
  vendorId: string
): Promise<any> => {
  try {
    // Using raw SQL query instead of .group() which is causing TypeScript errors
    const { data, error } = await supabase.rpc('get_vendor_expense_summary', {
      vendor_id_param: vendorId
    });
    
    if (error) throw error;
    
    // Format the summary data
    const summary = {
      total: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
    };
    
    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        const amount = parseFloat(item.sum);
        summary[item.status] = amount;
        if (item.status !== "cancelled") {
          summary.total += amount;
        }
      });
    }
    
    return summary;
  } catch (error) {
    console.error("Error fetching vendor expense summary:", error);
    throw error;
  }
};

// Export vendor expense report
export const exportVendorExpenseReport = async (
  vendorId: string
): Promise<{ filename: string; content: string }> => {
  try {
    // Get vendor details
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("name")
      .eq("id", vendorId)
      .single();
    if (vendorError) throw vendorError;
    // Get expenses
    const expenses = await getExpensesByVendor(vendorId);
    // Create CSV content
    const headers = [
      "Date",
      "Expense",
      "Category",
      "Amount",
      "Status",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [
          expense.date,
          `"${expense.name.replace(/"/g, '""')}"`,
          expense.category,
          expense.amount,
          expense.status,
          expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : "",
        ].join(",")
      ),
    ].join("\n");
    const filename = `${vendor.name.replace(/\s+/g, "_")}_expenses_${new Date().toISOString().split("T")[0]}.csv`;
    return {
      filename,
      content: csvContent,
    };
  } catch (error) {
    console.error("Error exporting vendor expense report:", error);
    throw error;
  }
};
