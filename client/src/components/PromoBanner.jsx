import React from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Truck } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const PromoBanner = () => {
    const { totalPrice } = useCart();
    const { t } = useLanguage();

    const threshold = 1000;
    const progress = Math.min((totalPrice / threshold) * 100, 100);
    const remaining = threshold - totalPrice;
    const isFreeShipping = totalPrice >= threshold;

    return (
        <div style={{
            background: 'var(--bg-secondary)', // Use theme background for better contrast with bar
            borderBottom: '1px solid var(--border-color)',
            padding: '10px 0',
            fontSize: '0.9rem',
            fontWeight: '500',
        }}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Truck size={18} style={{ color: '#C5A065' }} />
                    {isFreeShipping ? (
                        <span style={{ color: '#10B981', fontWeight: 'bold' }}>{t('freeShippingUnlocked')}</span>
                    ) : (
                        <span>
                            {t('freeShippingOver')} {formatCurrency(threshold)} - {t('addMore')} <span style={{ color: '#C5A065', fontWeight: 'bold' }}>{formatCurrency(remaining)}</span> {t('moreForFree')}
                        </span>
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ maxWidth: '400px', margin: '0 auto', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        background: isFreeShipping ? '#10B981' : '#C5A065',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease-out'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
