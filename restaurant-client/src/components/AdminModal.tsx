import React from 'react';
import './css/AdminModal.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AdminModal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default AdminModal;
