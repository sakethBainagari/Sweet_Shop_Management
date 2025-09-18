import React, { useState } from 'react';
import { Sweet, PurchaseData } from '../../types/sweet';
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import PurchaseModal from './PurchaseModal';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, data: PurchaseData) => Promise<any>;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (sweet: Sweet) => Promise<void>;
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
    
    try {
      setIsDeleting(true);
      await onDelete(sweet);
    } catch (error) {
      console.error('Error deleting sweet:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="card-elevated bg-white hover:shadow-large transition-all duration-300 group">
        {/* Sweet Image Placeholder */}
        <div className="h-48 bg-gradient-to-br from-accent-100 to-secondary-100 flex items-center justify-center">
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🍰</span>
        </div>

        <div className="p-4">
          {/* Sweet Info */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-neutral-900 truncate flex-1">
              {sweet.name}
            </h3>
            <span className="text-lg font-bold text-success-600 ml-2">
              {formatCurrency(sweet.price)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full font-medium">
              {sweet.category}
            </span>
            <span className={`text-sm font-medium ${
              isOutOfStock ? 'text-error-600' : 'text-neutral-600'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} available`}
            </span>
          </div>

          {sweet.description && (
            <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
              {sweet.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Purchase Button (for all authenticated users) */}
            <button
              onClick={() => setShowPurchaseModal(true)}
              disabled={isOutOfStock}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit?.(sweet)}
                  className="flex-1 py-1 px-3 bg-warning-500 text-white rounded-md text-sm hover:bg-warning-600 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRestock?.(sweet)}
                  className="flex-1 py-1 px-3 bg-success-500 text-white rounded-md text-sm hover:bg-success-600 transition-colors font-medium"
                >
                  Restock
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-1 px-3 bg-error-500 text-white rounded-md text-sm hover:bg-error-600 transition-colors disabled:opacity-50 font-medium"
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