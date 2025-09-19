import React from 'react';

interface SampleCredentialsProps {
  className?: string;
  onFillCredentials?: (email: string, password: string) => void;
}

export const SampleCredentials: React.FC<SampleCredentialsProps> = ({ 
  className = '', 
  onFillCredentials 
}) => {
  const handleCopyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
  };

  const handleFillCredentials = (email: string, password: string) => {
    if (onFillCredentials) {
      onFillCredentials(email, password);
    } else {
      // Fallback: try to fill form fields directly
      const emailField = document.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordField = document.querySelector('input[name="password"]') as HTMLInputElement;
      
      if (emailField && passwordField) {
        emailField.value = email;
        passwordField.value = password;
        
        // Trigger events to update React state
        emailField.dispatchEvent(new Event('input', { bubbles: true }));
        passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-blue-800 mb-3">
        🧪 Sample Login Credentials (For Testing)
      </h3>
      
      <div className="space-y-3">
        {/* Admin Credentials */}
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">👨‍💼 Admin Account</p>
              <p className="text-sm font-mono text-gray-800">admin@sweetshop.com</p>
              <p className="text-sm font-mono text-gray-800">admin123456</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFillCredentials('admin@sweetshop.com', 'admin123456')}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                title="Fill form with admin credentials"
              >
                📝 Fill
              </button>
              <button
                onClick={() => handleCopyCredentials('admin@sweetshop.com', 'admin123456')}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                title="Copy credentials"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Customer Credentials */}
        <div className="bg-white rounded-md p-3 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">👤 Customer Account</p>
              <p className="text-sm font-mono text-gray-800">customer@example.com</p>
              <p className="text-sm font-mono text-gray-800">customer123</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFillCredentials('customer@example.com', 'customer123')}
                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                title="Fill form with customer credentials"
              >
                📝 Fill
              </button>
              <button
                onClick={() => handleCopyCredentials('customer@example.com', 'customer123')}
                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition-colors"
                title="Copy credentials"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-blue-100">
        <p className="text-xs text-blue-600">
          💡 <strong>Admin features:</strong> Create, edit, delete sweets, manage inventory
        </p>
        <p className="text-xs text-blue-600">
          💡 <strong>Customer features:</strong> Browse sweets, make purchases, view history
        </p>
      </div>
    </div>
  );
};