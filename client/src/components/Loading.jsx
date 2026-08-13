import React from 'react';
import logo from '../assets/naqsha-logo.jpg';

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
      <style>
        {`
          @keyframes pulse-gold {
            0% { box-shadow: 0 0 0 0 rgba(197, 160, 101, 0.4); transform: scale(1); }
            70% { box-shadow: 0 0 0 20px rgba(197, 160, 101, 0); transform: scale(1.05); }
            100% { box-shadow: 0 0 0 0 rgba(197, 160, 101, 0); transform: scale(1); }
          }
        `}
      </style>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'white',
        padding: '5px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        animation: 'pulse-gold 2s infinite'
      }}>
        <img 
          src={logo} 
          alt="Loading..." 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }} 
        />
      </div>
      <h2 style={{ 
        marginTop: '25px', 
        color: 'var(--primary)', 
        letterSpacing: '4px',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>NAQSHA</h2>
    </div>
  );
};

export default Loading;
