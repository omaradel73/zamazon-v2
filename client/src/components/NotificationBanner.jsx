import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const NotificationBanner = () => {
  const { notification, closeNotification } = useNotification();

  if (!notification) return null;

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.9)', icon: <CheckCircle size={20} /> };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.9)', icon: <AlertCircle size={20} /> };
      default:
        return { bg: 'rgba(59, 130, 246, 0.9)', icon: <Info size={20} /> };
    }
  };

  const style = getStyles(notification.type);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 24px',
      borderRadius: '12px',
      backgroundColor: style.bg,
      color: 'white',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      animation: 'slideDown 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '90%'
    }}>
      <style>
        {`
          @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
        `}
      </style>
      
      {style.icon}
      
      <span style={{ fontWeight: 500, flex: 1 }}>{notification.message}</span>
      
      <button 
        onClick={closeNotification}
        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default NotificationBanner;
