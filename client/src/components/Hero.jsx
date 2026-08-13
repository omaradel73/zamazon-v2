import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../assets/ramadan-package.jpg';

const Hero = ({ scrollToProducts, scrollToFeedback }) => {
  const { t } = useLanguage();
  const calculateTimeLeft = () => {
    const storedEndTime = localStorage.getItem('ramadanOfferEndTime');
    let endTime;

    if (storedEndTime) {
      endTime = new Date(storedEndTime);
    } else {
      endTime = new Date();
      endTime.setHours(endTime.getHours() + 48);
      localStorage.setItem('ramadanOfferEndTime', endTime.toISOString());
    }

    const difference = endTime - new Date();

    if (difference <= 0) {
      // Create new cycle if expired
      const newEndTime = new Date();
      newEndTime.setHours(newEndTime.getHours() + 48);
      localStorage.setItem('ramadanOfferEndTime', newEndTime.toISOString());
      return { hours: 47, minutes: 59, seconds: 59 };
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60))),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (val) => val.toString().padStart(2, '0');

  return (
    <section className="page-enter" style={{
      padding: '4rem 0',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Dynamic Background Elements */}
      <div className="hero-blob" style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(197, 160, 101, 0.15) 0%, transparent 70%)', /* Gold tint */
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1,
        animation: 'pulse 8s infinite ease-in-out'
      }} />
      <div className="hero-blob" style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(93, 64, 55, 0.1) 0%, transparent 70%)', /* Brown tint */
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1
      }} />

      <div className="container responsive-grid" style={{ alignItems: 'center' }}>

        {/* Mobile Hero (New) */}
        <div className="mobile-hero-content fade-in">
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(197, 160, 101, 0.4)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <Zap size={14} fill="white" /> {t('ramadanOffer')}
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '0.5rem' }}>بوكس رمضان</h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem', direction: 'rtl' }}>
              عرض خاص: <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>350 ج.م</span> <strong>299 ج.م</strong>
            </p>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
              ⏳ {t('endsIn')}: {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={scrollToProducts}
                style={{
                  background: 'white',
                  color: 'var(--secondary)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  flex: 1
                }}
              >
                {t('offer')}
              </button>
              <button
                onClick={scrollToFeedback}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.4)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  flex: 1
                }}
              >
                {t('reviews')}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Content (Hidden on Mobile) */}
        <div className="fade-in hero-content desktop-hero-content">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(197, 160, 101, 0.1)',
            border: '1px solid rgba(197, 160, 101, 0.2)',
            borderRadius: '99px',
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <Zap size={16} fill="var(--primary)" /> Ramadan Kareem
          </div>

          <h1 className="hero-title" style={{ color: 'var(--text-primary)' }}>
            Ramadan <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Package Offer</span>
          </h1>

          <p className="hero-subtitle">
            Celebrate the holy month with Naqsha. Get our exclusive Ramadan Package for just <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>$350</span> <strong>$259</strong>. Limited time offer.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary"
              onClick={scrollToProducts}
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {t('exploreCollection')} <ArrowRight size={20} />
            </button>
            <button
              onClick={scrollToFeedback}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                background: 'transparent',
                border: '1px solid var(--text-secondary)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {t('seeReviews')}
            </button>
          </div>

          <div className="hero-stats" style={{ marginTop: '3rem', display: 'flex', gap: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '1.5rem' }}>100%</strong>
              Authentic
            </div>
            <div style={{ width: '1px', background: 'var(--border-color)' }}></div>
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '1.5rem' }}>24h</strong>
              Delivery
            </div>
          </div>
        </div>

        {/* Right Image (Desktop Only) */}
        <div className="hero-image-right desktop-hero-content" style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle, var(--primary) 0%, transparent 60%)',
            opacity: 0.1,
            filter: 'blur(60px)',
            zIndex: -1
          }} />
          <img
            src={heroImage}
            alt="Ramadan Collection"
            style={{
              width: '100%',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(62, 39, 35, 0.25)',
              transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)',
              border: '1px solid rgba(255,255,255,0.5)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />

          {/* Removed Floating Card for cleaner look */}
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
