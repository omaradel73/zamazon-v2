import React from 'react';

const Loading = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      transition: 'opacity 0.5s ease-out'
    }}>
      <div className="spinner"></div>
      <h2 style={{ marginTop: '20px', color: 'var(--primary)', letterSpacing: '2px' }}>ZAMAZON</h2>
    </div>
  );
};

export default Loading;
