import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                showNotification("Reset code sent! Check your email.", "success");
                navigate('/reset-password', { state: { email } });
            } else {
                showNotification(data.message, "error");
            }
        } catch (err) {
            showNotification("Failed to send code", "error");
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Forgot Password</h2>
                {msg && <p style={{ color: 'red' }}>{msg}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send Reset Code</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
