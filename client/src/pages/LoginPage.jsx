import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.user);
      showNotification(`Welcome back, ${data.user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container page-enter" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('welcomeBack')}</h2>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('email')}</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t('password')}</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none' }}>{t('forgotPassword')}</Link>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>{t('signInButton')}</button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
          <span style={{ background: 'var(--glass-bg)', padding: '0 10px', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>or</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 0 }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                login(data.user);
                showNotification(`Welcome, ${data.user.name}!`, 'success');
                navigate('/');
              } catch (err) {
                setError(err.message);
              }
            }}
            onError={() => {
              setError('Google Login Failed');
            }}
            shape="pill"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          {t('newToNaqsha')} <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{t('createAccount')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
