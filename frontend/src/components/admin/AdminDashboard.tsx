import React, { useState, useEffect } from 'react';
import { Sweet } from '../../types/sweet';
import { SweetService } from '../../services/sweetService';
import SweetForm from './SweetForm';
import RestockModal from './RestockModal';
import Loading from '../common/Loading';

interface AdminDashboardProps {
  onSweetUpdated?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSweetUpdated }) => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [formLoading, setFormLoading] = useState(false);

  // Get unique categories from sweets
  const categories = Array.from(new Set(sweets.map(sweet => sweet.category))).sort();

  // Filter sweets based on search and category
  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sweet.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch sweets
  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError('');
      const sweets = await SweetService.getAllSweets();
      setSweets(sweets);
    } catch (err) {
      setError('Failed to fetch sweets. Please try again.');
      console.error('Error fetching sweets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // Handle form submission for create/update
  const handleFormSubmit = async (sweetData: any) => {
    setFormLoading(true);
    setFormError('');

    try {
      if (editingSweet) {
        await SweetService.updateSweet(editingSweet.id, sweetData);
      } else {
        await SweetService.createSweet(sweetData);
      }
      
      await fetchSweets();
      onSweetUpdated?.();
      setShowForm(false);
      setEditingSweet(null);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save sweet. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle sweet deletion
  const handleDeleteSweet = async (sweetId: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) {
      return;
    }

    try {
      await SweetService.deleteSweet(sweetId);
      await fetchSweets();
      onSweetUpdated?.();
    } catch (err) {
      setError('Failed to delete sweet. Please try again.');
    }
  };

  // Handle restock
  const handleRestock = async (sweetId: string, quantity: number) => {
    try {
      await SweetService.restockSweet(sweetId, { quantity });
      await fetchSweets();
      onSweetUpdated?.();
    } catch (err) {
      throw new Error('Failed to restock sweet');
    }
  };

  // Handle form open/close
  const handleAddNew = () => {
    setEditingSweet(null);
    setShowForm(true);
    setFormError('');
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
    setFormError('');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSweet(null);
    setFormError('');
  };

  // Low stock threshold
  const LOW_STOCK_THRESHOLD = 10;
  const lowStockSweets = sweets.filter(sweet => sweet.quantity <= LOW_STOCK_THRESHOLD);

  if (loading) {
    return <Loading />;
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <button
            onClick={handleFormClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {editingSweet ? (
          <SweetForm
            sweet={editingSweet}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
            isLoading={formLoading}
            error={formError}
          />
        ) : (
          <SweetForm
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
            isLoading={formLoading}
            error={formError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Sweet Management</h2>
        <button
          onClick={handleAddNew}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Add New Sweet
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockSweets.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {lowStockSweets.length} sweet{lowStockSweets.length !== 1 ? 's' : ''} {lowStockSweets.length === 1 ? 'is' : 'are'} running low on stock:
                </p>
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  {lowStockSweets.map(sweet => (
                    <li key={sweet.id}>
                      {sweet.name} ({sweet.quantity} remaining)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sweets Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sweet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSweets.map((sweet) => (
                <tr key={sweet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sweet.name}
                      </div>
                      {sweet.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {sweet.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sweet.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${sweet.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sweet.quantity <= LOW_STOCK_THRESHOLD
                        ? 'bg-red-100 text-red-800'
                        : sweet.quantity <= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {sweet.quantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(sweet)}
                      className="text-pink-600 hover:text-pink-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setRestockSweet(sweet)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => handleDeleteSweet(sweet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSweets.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-4 0H9m-4 0H4m4-7h8m-4 0v2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sweets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory ? 'Try adjusting your search or filter.' : 'Get started by adding a new sweet.'}
            </p>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      <RestockModal
        sweet={restockSweet}
        isOpen={!!restockSweet}
        onClose={() => setRestockSweet(null)}
        onRestock={handleRestock}
      />
    </div>
  );
};

export default AdminDashboard;