import React from 'react';
import { Sweet, PurchaseData } from '../../types/sweet';
import SweetCard from './SweetCard';
import Loading from '../common/Loading';

interface SweetListProps {
  sweets: Sweet[];
  isLoading: boolean;
  error: string | null;
  onPurchase: (id: string, data: PurchaseData) => Promise<any>;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => Promise<void>;
  onRestock?: (sweet: Sweet) => void;
}

const SweetList: React.FC<SweetListProps> = ({
  sweets,
  isLoading,
  error,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  if (isLoading && sweets.length === 0) {
    return <Loading message="Loading delicious sweets..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Sweets</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (sweets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Sweets Found</h3>
        <p className="text-gray-600">Try adjusting your search filters or check back later for new additions.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {sweets.length} Sweet{sweets.length !== 1 ? 's' : ''} Found
        </h2>
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
            Updating...
          </div>
        )}
      </div>

      {/* Sweet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sweets.map((sweet) => (
          <SweetCard
            key={sweet.id}
            sweet={sweet}
            onPurchase={onPurchase}
            {...(onEdit && { onEdit })}
            {...(onDelete && { onDelete })}
            {...(onRestock && { onRestock })}
          />
        ))}
      </div>

      {/* Load More Placeholder (for future pagination) */}
      {sweets.length >= 12 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Showing {sweets.length} sweets
          </p>
        </div>
      )}
    </div>
  );
};

export default SweetList;