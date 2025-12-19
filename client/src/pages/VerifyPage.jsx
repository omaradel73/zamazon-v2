import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const VerifyPage = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(0); 
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    
    // ... useEffect ...

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            if (res.ok) {
                showNotification("Verified! Please login.", "success");
                navigate('/login');
            } else {
                showNotification(data.message, "error");
            }
        } catch (err) {
            showNotification("Verification failed", "error");
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setMsg('');
        try {
            const res = await fetch('/api/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setTimer(60); // Start 60s cooldown
                setMsg("Code resent! Check your email (or logs).");
            } else {
                setMsg(data.message);
            }
        } catch (err) {
            setMsg("Failed to resend code");
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Verify Email</h2>
                {msg && <p style={{ color: msg.includes('resent') ? 'green' : 'red', textAlign: 'center' }}>{msg}</p>}
                <form onSubmit={handleVerify}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            disabled={!!location.state?.email} // Disable if passed from register
                            style={{ width: '100%', opacity: location.state?.email ? 0.7 : 1 }} 
                            placeholder="Enter your email"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Verification Code</label>
                        <input 
                            type="text" 
                            value={code} 
                            onChange={e => setCode(e.target.value)} 
                            required 
                            style={{ width: '100%' }} 
                            placeholder="6-digit code"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Verify</button>
                    
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button 
                            type="button" 
                            onClick={handleResend}
                            disabled={timer > 0 || !email}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: timer > 0 ? 'var(--text-secondary)' : 'var(--primary)', 
                                cursor: timer > 0 ? 'default' : 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyPage;
