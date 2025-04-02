// tests/supabaseService.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSupabaseService } from '../src/composables/useSupabaseService';
import { supabase } from '../src/lib/supabase';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        })),
        order: vi.fn(() => ({
          limit: vi.fn()
        })),
        limit: vi.fn()
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://example.com/test.jpg' }
        }))
      }))
    }
  }
}));

describe('useSupabaseService composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch data from a table', async () => {
    // Mock successful data fetch
    const mockData = [{ id: '1', name: 'Test' }];
    const mockResponse = { data: mockData, error: null };
    
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(mockResponse)
      }),
      order: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockResponse)
      }),
      limit: vi.fn().mockResolvedValue(mockResponse)
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      select: selectMock
    } as any);

    const { fetchData } = useSupabaseService();
    const result = await fetchData('guests', { filter: { user_id: '123' } });

    expect(supabase.from).toHaveBeenCalledWith('guests');
    expect(selectMock).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    // Mock failed data fetch
    const mockError = { code: 'PGRST301', message: 'Resource not found' };
    const mockResponse = { data: null, error: mockError };
    
    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue(mockResponse)
      })
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      select: selectMock
    } as any);

    const { fetchData, getUserFriendlyErrorMessage } = useSupabaseService();
    const result = await fetchData('nonexistent_table');

    expect(supabase.from).toHaveBeenCalledWith('nonexistent_table');
    expect(result.error).toEqual(mockError);
    
    // Test error message formatting
    const errorMessage = getUserFriendlyErrorMessage(mockError);
    expect(errorMessage).toBe('Die Ressource wurde nicht gefunden.');
  });

  it('should insert data into a table', async () => {
    // Mock successful data insert
    const mockData = { id: '1', name: 'New Item', created_at: '2025-04-02T12:00:00Z' };
    const mockResponse = { data: mockData, error: null };
    
    const selectMock = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue(mockResponse)
    });
    
    const insertMock = vi.fn().mockReturnValue({
      select: selectMock
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: insertMock
    } as any);

    const { insertData } = useSupabaseService();
    const newItem = { name: 'New Item' };
    const result = await insertData('guests', newItem);

    expect(supabase.from).toHaveBeenCalledWith('guests');
    expect(insertMock).toHaveBeenCalledWith(newItem);
    expect(selectMock).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('should update data in a table', async () => {
    // Mock successful data update
    const mockData = { id: '1', name: 'Updated Item', updated_at: '2025-04-02T12:00:00Z' };
    const mockResponse = { data: mockData, error: null };
    
    const selectMock = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue(mockResponse)
    });
    
    const eqMock = vi.fn().mockReturnValue({
      select: selectMock
    });
    
    const updateMock = vi.fn().mockReturnValue({
      eq: eqMock
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      update: updateMock
    } as any);

    const { updateData } = useSupabaseService();
    const updates = { name: 'Updated Item' };
    const result = await updateData('guests', '1', updates);

    expect(supabase.from).toHaveBeenCalledWith('guests');
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining(updates));
    expect(eqMock).toHaveBeenCalledWith('id', '1');
    expect(selectMock).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it('should delete data from a table', async () => {
    // Mock successful data delete
    const mockResponse = { data: null, error: null };
    
    const eqMock = vi.fn().mockResolvedValue(mockResponse);
    
    const deleteMock = vi.fn().mockReturnValue({
      eq: eqMock
    });
    
    vi.mocked(supabase.from).mockReturnValue({
      delete: deleteMock
    } as any);

    const { deleteData } = useSupabaseService();
    const result = await deleteData('guests', '1');

    expect(supabase.from).toHaveBeenCalledWith('guests');
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith('id', '1');
    expect(result.error).toBeNull();
  });
});
