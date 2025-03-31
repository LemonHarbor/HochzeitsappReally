import { supabase } from '@/lib/supabaseClient';
import { Table, TableGroup, TableGuest, TableFormData } from '@/types/table';

/**
 * Get all tables
 */
export const getTables = async (): Promise<Table[]> => {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tables:', error);
    throw new Error('Failed to fetch tables');
  }

  return data || [];
};

/**
 * Get a table by ID
 */
export const getTable = async (tableId: string): Promise<Table> => {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('id', tableId)
    .single();

  if (error) {
    console.error('Error fetching table:', error);
    throw new Error('Failed to fetch table');
  }

  return data;
};

/**
 * Create a new table
 */
export const createTable = async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>): Promise<Table> => {
  const { data, error } = await supabase
    .from('tables')
    .insert(tableData)
    .select()
    .single();

  if (error) {
    console.error('Error creating table:', error);
    throw new Error('Failed to create table');
  }

  return data;
};

/**
 * Update a table
 */
export const updateTable = async (tableId: string, tableData: Partial<Table>): Promise<Table> => {
  const { data, error } = await supabase
    .from('tables')
    .update(tableData)
    .eq('id', tableId)
    .select()
    .single();

  if (error) {
    console.error('Error updating table:', error);
    throw new Error('Failed to update table');
  }

  return data;
};

/**
 * Delete a table
 */
export const deleteTable = async (tableId: string): Promise<void> => {
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', tableId);

  if (error) {
    console.error('Error deleting table:', error);
    throw new Error('Failed to delete table');
  }
};

/**
 * Get all table groups
 */
export const getTableGroups = async (): Promise<TableGroup[]> => {
  const { data, error } = await supabase
    .from('table_groups')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching table groups:', error);
    throw new Error('Failed to fetch table groups');
  }

  return data || [];
};

/**
 * Create a new table group
 */
export const createTableGroup = async (groupData: Omit<TableGroup, 'id' | 'created_at' | 'updated_at'>): Promise<TableGroup> => {
  const { data, error } = await supabase
    .from('table_groups')
    .insert(groupData)
    .select()
    .single();

  if (error) {
    console.error('Error creating table group:', error);
    throw new Error('Failed to create table group');
  }

  return data;
};

/**
 * Update a table group
 */
export const updateTableGroup = async (groupId: string, groupData: Partial<TableGroup>): Promise<TableGroup> => {
  const { data, error } = await supabase
    .from('table_groups')
    .update(groupData)
    .eq('id', groupId)
    .select()
    .single();

  if (error) {
    console.error('Error updating table group:', error);
    throw new Error('Failed to update table group');
  }

  return data;
};

/**
 * Delete a table group
 */
export const deleteTableGroup = async (groupId: string): Promise<void> => {
  const { error } = await supabase
    .from('table_groups')
    .delete()
    .eq('id', groupId);

  if (error) {
    console.error('Error deleting table group:', error);
    throw new Error('Failed to delete table group');
  }
};

/**
 * Get all guests assigned to tables
 */
export const getTableGuests = async (): Promise<TableGuest[]> => {
  const { data, error } = await supabase
    .from('table_guests')
    .select('*');

  if (error) {
    console.error('Error fetching table guests:', error);
    throw new Error('Failed to fetch table guests');
  }

  return data || [];
};

/**
 * Assign a guest to a table
 */
export const assignGuestToTable = async (tableId: string, guestId: string, seatNumber?: number): Promise<TableGuest> => {
  const { data, error } = await supabase
    .from('table_guests')
    .insert({
      table_id: tableId,
      guest_id: guestId,
      seat_number: seatNumber
    })
    .select()
    .single();

  if (error) {
    console.error('Error assigning guest to table:', error);
    throw new Error('Failed to assign guest to table');
  }

  return data;
};

/**
 * Remove a guest from a table
 */
export const removeGuestFromTable = async (tableGuestId: string): Promise<void> => {
  const { error } = await supabase
    .from('table_guests')
    .delete()
    .eq('id', tableGuestId);

  if (error) {
    console.error('Error removing guest from table:', error);
    throw new Error('Failed to remove guest from table');
  }
};

/**
 * Update a guest's seat at a table
 */
export const updateGuestSeat = async (tableGuestId: string, seatNumber: number): Promise<TableGuest> => {
  const { data, error } = await supabase
    .from('table_guests')
    .update({ seat_number: seatNumber })
    .eq('id', tableGuestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating guest seat:', error);
    throw new Error('Failed to update guest seat');
  }

  return data;
};
