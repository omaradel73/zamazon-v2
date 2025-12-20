import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, ShoppingBag, LogOut, Home } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        // Future: Split Orders/Users into separate pages if needed, for now they are tabs in AdminPage
        // { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        // { path: '/admin/users', icon: <Users size={20} />, label: 'Users' }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar" style={{ 
                width: '250px', 
                background: 'var(--bg-primary)', 
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem'
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <img src="/logo.png" alt="Zamazon" style={{ height: '32px' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Admin</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link to="/" style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px', 
                        padding: '10px 1rem', 
                        borderRadius: '8px', 
                        color: 'var(--text-secondary)', 
                        textDecoration: 'none',
                        marginBottom: '1rem'
                    }}>
                        <Home size={20} /> Back to Shop
                    </Link>

                    {navItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '10px', 
                                padding: '10px 1rem', 
                                borderRadius: '8px', 
                                color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-primary)',
                                background: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                fontWeight: location.pathname === item.path ? '600' : 'normal',
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: '600' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '10px', 
                            padding: '10px 1rem', 
                            width: '100%',
                            border: 'none', 
                            background: 'none',
                            color: '#ef4444', 
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
