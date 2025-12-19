import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyPage = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // To auto-login if verify succeeds? Or just redirect to login.

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
                alert("Verified! Please login.");
                navigate('/login');
            } else {
                setMsg(data.message);
            }
        } catch (err) {
            setMsg("Verification failed");
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Verify Email</h2>
                {msg && <p style={{ color: 'red' }}>{msg}</p>}
                <form onSubmit={handleVerify}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            style={{ width: '100%' }} 
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
                </form>
            </div>
        </div>
    );
};

export default VerifyPage;
