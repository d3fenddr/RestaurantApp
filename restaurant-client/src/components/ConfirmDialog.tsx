import React from 'react';
import './css/AdminModal.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{message}</p>
        <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button style={{ background: 'var(--accent-color)' }} onClick={onConfirm}>Yes</button>
          <button style={{ background: '#aaa' }} onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
