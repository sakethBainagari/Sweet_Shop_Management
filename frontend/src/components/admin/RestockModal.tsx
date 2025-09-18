import React, { useState } from 'react';
import { Sweet } from '../../types/sweet';

interface RestockModalProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onRestock: (sweetId: string, quantity: number) => Promise<void>;
}

const RestockModal: React.FC<RestockModalProps> = ({
  sweet,
  isOpen,
  onClose,
  onRestock,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sweet) return;
    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onRestock(sweet.id, quantity);
      setQuantity(0);
      onClose();
    } catch (err) {
      setError('Failed to restock sweet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity(0);
    setError('');
    onClose();
  };

  if (!isOpen || !sweet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Restock Sweet</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Sweet Details</div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium text-gray-900">{sweet.name}</div>
            <div className="text-sm text-gray-600">
              Current Stock: {sweet.quantity} {sweet.quantity === 1 ? 'item' : 'items'}
            </div>
            <div className="text-sm text-gray-600">
              Category: {sweet.category}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Add
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max="10000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter quantity to add..."
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {quantity > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">
                New total stock will be: <strong>{sweet.quantity + quantity} items</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading || quantity <= 0}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Restocking...
                </>
              ) : (
                'Restock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;