import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Side } from '@/types/menu';
import { toast } from 'sonner';

export function useSidesData() {
  const [sides, setSides] = useState<Side[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('sides')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setSides(data || []);
    } catch (err) {
      console.error('Error fetching sides:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sides');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSide = async (side: Omit<Side, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('sides')
        .insert([side])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSides(prev => [...prev, data]);
      toast.success('Side added successfully');
      return data;
    } catch (err) {
      console.error('Error adding side:', err);
      toast.error('Failed to add side');
      throw err;
    }
  };

  const updateSide = async (id: string, updates: Partial<Side>) => {
    try {
      const { data, error } = await supabase
        .from('sides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSides(prev => prev.map(side => side.id === id ? data : side));
      toast.success('Side updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating side:', err);
      toast.error('Failed to update side');
      throw err;
    }
  };

  const deleteSide = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sides')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSides(prev => prev.filter(side => side.id !== id));
      toast.success('Side deleted successfully');
    } catch (err) {
      console.error('Error deleting side:', err);
      toast.error('Failed to delete side');
      throw err;
    }
  };

  useEffect(() => {
    fetchSides();
  }, [fetchSides]);

  return {
    sides,
    loading,
    error,
    addSide,
    updateSide,
    deleteSide,
    refetch: fetchSides
  };
}