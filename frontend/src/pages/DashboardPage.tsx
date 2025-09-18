import React, { useState } from 'react';
import { useSweets } from '../hooks/useSweets';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/sweets/SearchFilter';
import SweetList from '../components/sweets/SweetList';
import EditSweetModal from '../components/admin/EditSweetModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';
import RestockModal from '../components/admin/RestockModal';
import { SearchFilters, PurchaseData, Sweet } from '../types/sweet';
import { getErrorMessage } from '../utils/helpers';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    sweets,
    categories,
    isLoading,
    error,
    searchSweets,
    purchaseSweet,
    fetchSweets,
    updateSweet,
    deleteSweet,
    restockSweet,
  } = useSweets();

  const [searchError, setSearchError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  
  // Modal states
  const [editModalSweet, setEditModalSweet] = useState<Sweet | null>(null);
  const [deleteModalSweet, setDeleteModalSweet] = useState<Sweet | null>(null);
  const [restockModalSweet, setRestockModalSweet] = useState<Sweet | null>(null);

  const handleFiltersChange = async (filters: SearchFilters) => {
    try {
      setSearchError(null);
      
      // If no filters are applied, fetch all sweets
      const hasFilters = filters.name || filters.category || 
                        filters.minPrice !== undefined || filters.maxPrice !== undefined;
      
      if (hasFilters) {
        await searchSweets(filters);
      } else {
        await fetchSweets();
      }
    } catch (error: any) {
      setSearchError(getErrorMessage(error));
    }
  };

  const handlePurchase = async (id: string, data: PurchaseData) => {
    try {
      const result = await purchaseSweet(id, data);
      setPurchaseSuccess(`Successfully purchased ${data.quantity} item(s) for $${result.purchase.totalPrice.toFixed(2)}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setPurchaseSuccess(null), 5000);
      
      return result;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditModalSweet(sweet);
  };

  const handleDelete = async (sweet: Sweet) => {
    setDeleteModalSweet(sweet);
  };

  const handleRestock = async (sweet: Sweet) => {
    setRestockModalSweet(sweet);
  };

  // Modal handlers
  const handleEditSubmit = async (id: string, data: any) => {
    await updateSweet(id, data);
    setEditModalSweet(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalSweet) {
      await deleteSweet(deleteModalSweet.id);
      setDeleteModalSweet(null);
    }
  };

  const handleRestockSubmit = async (sweetId: string, quantity: number) => {
    await restockSweet(sweetId, { quantity });
    setRestockModalSweet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sweet Shop Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {user?.name}! Discover our delicious collection of sweets.
              </p>
            </div>
            
            {user?.role === 'ADMIN' && (
              <div>
                <a
                  href="/admin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Admin Panel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {purchaseSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">{purchaseSuccess}</h3>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setPurchaseSuccess(null)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <SearchFilter
          categories={categories}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />

        {/* Sweet List */}
        <SweetList
          sweets={sweets}
          isLoading={isLoading}
          error={error || searchError}
          onPurchase={handlePurchase}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestock={handleRestock}
        />
      </div>

      {/* Admin Modals */}
      {editModalSweet && (
        <EditSweetModal
          sweet={editModalSweet}
          categories={categories}
          onEdit={handleEditSubmit}
          onClose={() => setEditModalSweet(null)}
        />
      )}

      {deleteModalSweet && (
        <DeleteConfirmationModal
          sweet={deleteModalSweet}
          onDelete={handleDeleteConfirm}
          onClose={() => setDeleteModalSweet(null)}
        />
      )}

      {restockModalSweet && (
        <RestockModal
          sweet={restockModalSweet}
          isOpen={true}
          onClose={() => setRestockModalSweet(null)}
          onRestock={handleRestockSubmit}
        />
      )}
    </div>
  );
};

export default DashboardPage;