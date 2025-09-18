import { useState, useEffect, useCallback } from 'react';
import { SweetService } from '../services/sweetService';
import { Sweet, SearchFilters, CreateSweetData, UpdateSweetData, PurchaseData, RestockData } from '../types/sweet';
import { LoadingState } from '../types/api';

export const useSweets = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, error: null });

  // Fetch all sweets
  const fetchSweets = useCallback(async () => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const data = await SweetService.getAllSweets();
      setSweets(data);
    } catch (error: any) {
      setLoadingState({ isLoading: false, error: error.message || 'Failed to fetch sweets' });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Search sweets with filters
  const searchSweets = useCallback(async (filters: SearchFilters) => {
    try {
      setLoadingState({ isLoading: true, error: null });
      const data = await SweetService.searchSweets(filters);
      setSweets(data);
    } catch (error: any) {
      setLoadingState({ isLoading: false, error: error.message || 'Failed to search sweets' });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await SweetService.getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Create new sweet
  const createSweet = useCallback(async (data: CreateSweetData): Promise<Sweet> => {
    const newSweet = await SweetService.createSweet(data);
    setSweets(prev => [newSweet, ...prev]);
    return newSweet;
  }, []);

  // Update sweet
  const updateSweet = useCallback(async (id: string, data: UpdateSweetData): Promise<Sweet> => {
    const updatedSweet = await SweetService.updateSweet(id, data);
    setSweets(prev => prev.map(sweet => sweet.id === id ? updatedSweet : sweet));
    return updatedSweet;
  }, []);

  // Delete sweet
  const deleteSweet = useCallback(async (id: string): Promise<void> => {
    await SweetService.deleteSweet(id);
    setSweets(prev => prev.filter(sweet => sweet.id !== id));
  }, []);

  // Purchase sweet
  const purchaseSweet = useCallback(async (id: string, data: PurchaseData) => {
    const result = await SweetService.purchaseSweet(id, data);
    
    // Update the sweet quantity in local state
    setSweets(prev => prev.map(sweet => 
      sweet.id === id 
        ? { ...sweet, quantity: result.updatedSweet.quantity }
        : sweet
    ));
    
    return result;
  }, []);

  // Restock sweet
  const restockSweet = useCallback(async (id: string, data: RestockData): Promise<Sweet> => {
    const updatedSweet = await SweetService.restockSweet(id, data);
    setSweets(prev => prev.map(sweet => sweet.id === id ? updatedSweet : sweet));
    return updatedSweet;
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchSweets();
    fetchCategories();
  }, [fetchSweets, fetchCategories]);

  return {
    sweets,
    categories,
    isLoading: loadingState.isLoading,
    error: loadingState.error,
    fetchSweets,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    refreshData: () => {
      fetchSweets();
      fetchCategories();
    }
  };
};