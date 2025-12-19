import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const Hero = ({ scrollToProducts }) => {
  return (
    <section style={{ 
      padding: '4rem 0', 
      position: 'relative', 
      overflow: 'hidden',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* ... (Background elements same as before) ... */}
      
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1,
        animation: 'pulse 8s infinite ease-in-out'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1
      }} />

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Content */}
        <div className="fade-in">
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            background: 'rgba(124, 58, 237, 0.1)', 
            border: '1px solid rgba(124, 58, 237, 0.2)', 
            borderRadius: '99px',
            color: '#d8b4fe',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <Zap size={16} fill="#d8b4fe" /> v2.0 is Live
          </div>
          
          <h1 style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            marginBottom: '1.5rem',
            lineHeight: 1,
            letterSpacing: '-2px'
          }}>
            Next Gen <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
             }}>Commerce</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-secondary)', 
            maxWidth: '500px', 
            lineHeight: 1.6,
            marginBottom: '2.5rem' 
          }}>
            Experience Zamazon. The world's fastest growing premium marketplace. 
            Powered by AI, secure payments, and instant delivery.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
                className="btn-primary" 
                onClick={scrollToProducts}
                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              Start Shopping <ArrowRight size={20} />
            </button>
            <button style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              padding: '1rem 2.5rem', 
              fontSize: '1.1rem',
              color: 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              View Categories
            </button>
          </div>
          
          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div>
                <strong style={{ color: 'white', display: 'block', fontSize: '1.5rem' }}>50k+</strong>
                Products
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
                <strong style={{ color: 'white', display: 'block', fontSize: '1.5rem' }}>24h</strong>
                Delivery
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, var(--primary) 0%, transparent 60%)',
                opacity: 0.2,
                filter: 'blur(60px)',
                zIndex: -1
            }} />
            <img 
                src="https://images.unsplash.com/photo-1622952865768-36c469f44ba6?auto=format&fit=crop&q=80&w=800"
                alt="Tech Product" 
                style={{ 
                    width: '100%', 
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    animation: 'float 6s ease-in-out infinite'
                }} 
            />
            
            {/* Floating Card */}
            <div className="glass-panel" style={{
                position: 'absolute',
                bottom: '40px',
                left: '-40px',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                animation: 'float 6s ease-in-out infinite',
                animationDelay: '1s'
            }}>
                <div style={{ width: '40px', height: '40px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Best Seller</div>
                    <div style={{ fontWeight: 'bold' }}>Z-Headset Pro</div>
                </div>
            </div>
        </div>

      </div>
      
      <style>
        {`
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.15; }
                50% { transform: scale(1.1); opacity: 0.25; }
                100% { transform: scale(1); opacity: 0.15; }
            }
            @keyframes float {
                0% { transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateY(0px); }
                50% { transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateY(-20px); }
                100% { transform: perspective(1000px) rotateY(-10deg) rotateX(5deg) translateY(0px); }
            }
        `}
      </style>
    </section>
  );
};

export default Hero;
