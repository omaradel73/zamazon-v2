import { Home, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const { totalItems } = useCart();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: <Home size={24} />, label: 'Home', path: '/' },
        { icon: <User size={24} />, label: 'Profile', path: user ? '/profile' : '/login' },
        { icon: <ShoppingCart size={24} />, label: 'Cart', path: '/cart', badge: totalItems }
    ];

    if (user?.isAdmin) {
        navItems.push({ icon: <LayoutDashboard size={24} />, label: 'Admin', path: '/admin' });
    }

    return (
        <div className="bottom-nav">
            <style>
                {`
                    .bottom-nav {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: var(--glass-bg);
                        backdrop-filter: blur(20px);
                        border-top: 1px solid var(--border-color);
                        padding: 10px 0;
                        z-index: 100;
                        justify-content: space-around;
                        align-items: center;
                    }
                    
                    @media (max-width: 768px) {
                        .bottom-nav { display: flex; }
                        body { padding-bottom: 70px; } /* Prevent content from being hidden */
                    }

                    .nav-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-decoration: none;
                        color: var(--text-secondary);
                        font-size: 0.7rem;
                        gap: 4px;
                        transition: all 0.2s;
                        position: relative;
                    }

                    .nav-item.active {
                        color: var(--primary);
                    }
                    
                    .nav-badge {
                        position: absolute;
                        top: -5px;
                        right: 0px;
                        background: var(--primary);
                        color: white;
                        border-radius: 50%;
                        width: 16px;
                        height: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.6rem;
                    }
                `}
            </style>
            {navItems.map((item, index) => (
                <Link 
                    key={index} 
                    to={item.path} 
                    className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                    <div style={{ position: 'relative' }}>
                        {item.icon}
                        {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                    </div>
                    <span>{item.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default BottomNav;
