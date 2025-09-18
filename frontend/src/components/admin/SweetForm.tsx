import React, { useState, useEffect } from 'react';
import { CreateSweetData, UpdateSweetData, Sweet } from '../../types/sweet';
import { VALIDATION_RULES } from '../../utils/constants';

interface SweetFormProps {
  sweet?: Sweet; // For editing existing sweet
  categories: string[];
  onSubmit: (data: CreateSweetData | UpdateSweetData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const SweetForm: React.FC<SweetFormProps> = ({
  sweet,
  categories,
  onSubmit,
  onCancel,
  isLoading,
  error,
}) => {
  const isEditing = !!sweet;
  
  const [formData, setFormData] = useState<CreateSweetData>({
    name: sweet?.name || '',
    category: sweet?.category || '',
    price: sweet?.price || 0,
    quantity: sweet?.quantity || 0,
    description: sweet?.description || '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateSweetData, string>>>({});

  // Update form data when sweet prop changes (for editing)
  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description || '',
      });
    }
  }, [sweet]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateSweetData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      errors.name = `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`;
    } else if (formData.name.trim().length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      errors.name = `Name must be less than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long`;
    }

    // Category validation
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    // Price validation
    if (formData.price < VALIDATION_RULES.PRICE_MIN) {
      errors.price = `Price must be at least $${VALIDATION_RULES.PRICE_MIN}`;
    } else if (formData.price > VALIDATION_RULES.PRICE_MAX) {
      errors.price = `Price must be less than $${VALIDATION_RULES.PRICE_MAX}`;
    }

    // Quantity validation
    if (formData.quantity < VALIDATION_RULES.QUANTITY_MIN) {
      errors.quantity = `Quantity cannot be negative`;
    } else if (formData.quantity > VALIDATION_RULES.QUANTITY_MAX) {
      errors.quantity = `Quantity must be less than ${VALIDATION_RULES.QUANTITY_MAX}`;
    } else if (!Number.isInteger(formData.quantity)) {
      errors.quantity = 'Quantity must be a whole number';
    }

    // Description validation (optional)
    if (formData.description && formData.description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
      errors.description = `Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
    const submitData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: formData.price,
      quantity: formData.quantity,
      ...(formData.description && formData.description.trim() && { description: formData.description.trim() })
    };      await onSubmit(submitData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' 
        ? parseFloat(value) || 0
        : value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof CreateSweetData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Sweet Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter sweet name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>

          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>

          {/* Quantity Field */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.quantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {formErrors.quantity && (
              <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter description..."
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {(formData.description || '').length}/{VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Update Sweet' : 'Add Sweet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetForm;