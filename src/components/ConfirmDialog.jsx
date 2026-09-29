import React from 'react';
import { AlertTriangle, Trash2, LogOut, X, AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  iconType = 'danger', // 'danger' | 'logout' | 'warning'
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    if (iconType === 'logout') {
      return (
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <LogOut size={22} />
        </div>
      );
    }
    if (isDangerous) {
      return (
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Trash2 size={22} />
        </div>
      );
    }
    return (
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#fef3c7',
          color: '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <AlertTriangle size={22} />
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={onCancel} style={{ animation: 'fadeIn 180ms ease' }}>
      <div
        className="modal-dialog sm animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{ overflow: 'hidden' }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {renderIcon()}
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {title}
              </h3>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.55', margin: 0 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer" style={{ padding: '14px 20px', background: 'var(--bg-app)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            style={{ minWidth: '100px', justifyContent: 'center' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
