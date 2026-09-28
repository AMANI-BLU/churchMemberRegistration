import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useChurch();

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertTriangle size={18} color="#fca5a5" />;
      case 'info':
        return <Info size={18} color="#93c5fd" />;
      case 'success':
      default:
        return <CheckCircle2 size={18} color="#bfdbfe" />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'success'}`}>
        {renderIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
