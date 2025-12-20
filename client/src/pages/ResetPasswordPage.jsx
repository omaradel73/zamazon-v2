import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email] = useState(searchParams.get('email') || '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password reset successful. Please login.");
                navigate('/login');
            } else {
                setMsg(data.message);
            }
        } catch (err) {
            setMsg("Reset failed");
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Reset Password</h2>
                {msg && <p style={{ color: 'red' }}>{msg}</p>}
                <form onSubmit={handleSubmit}>
                     <div style={{ marginBottom: '1rem' }}>
                        <label>Email</label>
                        <input type="email" className="input-field" value={email} disabled style={{ opacity: 0.7 }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Reset Code</label>
                        <input type="text" className="input-field" value={code} onChange={e => setCode(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>New Password</label>
                        <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
