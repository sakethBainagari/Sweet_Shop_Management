import React, { useState } from 'react';
import { Sweet, PurchaseData } from '../../types/sweet';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import PurchaseModal from './PurchaseModal';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, data: PurchaseData) => Promise<any>;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => Promise<void>;
  onRestock?: (sweet: Sweet) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onPurchase, 
  onEdit, 
  onDelete, 
  onRestock 
}) => {
  const { user } = useAuth();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isOutOfStock = sweet.quantity === 0;

  const handlePurchase = async (data: PurchaseData) => {
    await onPurchase(sweet.id, data);
    setShowPurchaseModal(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${sweet.name}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(sweet.id);
    } catch (error) {
      console.error('Error deleting sweet:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Sweet Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
          <span className="text-6xl">🍰</span>
        </div>

        <div className="p-4">
          {/* Sweet Info */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
              {sweet.name}
            </h3>
            <span className="text-lg font-bold text-green-600 ml-2">
              {formatCurrency(sweet.price)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {sweet.category}
            </span>
            <span className={`text-sm font-medium ${
              isOutOfStock ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} available`}
            </span>
          </div>

          {sweet.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {sweet.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Purchase Button (for all authenticated users) */}
            <button
              onClick={() => setShowPurchaseModal(true)}
              disabled={isOutOfStock}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit?.(sweet)}
                  className="flex-1 py-1 px-3 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRestock?.(sweet)}
                  className="flex-1 py-1 px-3 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
                >
                  Restock
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-1 px-3 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          sweet={sweet}
          onPurchase={handlePurchase}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </>
  );
};

export default SweetCard;