// Create a stored procedure in Supabase to handle vendor expense summary
// This will replace the problematic .group() method in vendorService.ts

CREATE OR REPLACE FUNCTION get_vendor_expense_summary(vendor_id_param UUID)
RETURNS TABLE (
  status TEXT,
  sum NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    expenses.status,
    SUM(expenses.amount)
  FROM 
    expenses
  WHERE 
    expenses.vendor_id = vendor_id_param
  GROUP BY 
    expenses.status;
END;
$$;
