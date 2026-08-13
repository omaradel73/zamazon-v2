import React, { useState, useEffect, useRef } from 'react';
import { Star, Send, User, MessageCircle, ChevronLeft, ChevronRight, X, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const FeedbackSection = () => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const scrollRef = useRef(null);

    useEffect(() => {
        fetch('/api/feedback')
            .then(res => res.json())
            .then(data => {
                setFeedbacks(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('Please login to submit feedback');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    name: user.name,
                    rating: submission.rating,
                    comment: submission.comment
                })
            });

            if (res.ok) {
                setMessage('Thank you! Your feedback has been submitted for review.');
                setSubmission({ rating: 5, comment: '' });
                setTimeout(() => {
                    setIsFormOpen(false);
                    setMessage('');
                }, 2000);
            } else {
                setMessage('Failed to submit feedback. Please try again.');
            }
        } catch (err) {
            setMessage('Error submitting feedback.');
        } finally {
            setSubmitting(false);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320; // card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section style={{ padding: '4rem 0', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative Background Elements */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--primary)', opacity: '0.05', borderRadius: '50%', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--secondary)', opacity: '0.05', borderRadius: '50%', filter: 'blur(80px)' }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            {language === 'ar' ? (
                                <span style={{ color: 'var(--text-primary)' }}>{t('customerReviews')}</span>
                            ) : (
                                <>
                                    Voices of <span style={{ color: 'var(--primary)' }}>Naqsha</span>
                                </>
                            )}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {t('joinSatisified')}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => scroll('left')}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            className="nav-btn"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            className="nav-btn"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Feedback Carousel */}
                <div
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        paddingBottom: '2rem',
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE/Edge
                    }}
                    className="no-scrollbar"
                >
                    {/* Hide Scrollbar CSS Injection */}
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .nav-btn:hover { background: var(--primary) !important; color: white; border-color: var(--primary) !important; }
                        .feedback-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
                    `}</style>

                    {loading ? (
                        <div style={{ width: '100%', textAlign: 'center', padding: '2rem' }}>Loading reviews...</div>
                    ) : feedbacks.length > 0 ? (
                        feedbacks.map((feedback, idx) => (
                            <div
                                key={feedback._id || idx}
                                className="glass-panel feedback-card"
                                style={{
                                    minWidth: '300px',
                                    maxWidth: '300px',
                                    scrollSnapAlign: 'start',
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < feedback.rating ? "#eab308" : "none"}
                                                color={i < feedback.rating ? "#eab308" : "#cbd5e1"}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Quote size={24} style={{ position: 'absolute', top: -10, left: -10, opacity: 0.1, transform: 'scale(1.5)' }} />
                                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1rem', fontStyle: 'italic', position: 'relative', zIndex: 1, minHeight: '80px' }}>
                                            "{feedback.comment}"
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem'
                                    }}>
                                        {feedback.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{feedback.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t('verifiedCustomer')}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: 'var(--text-secondary)' }}>
                            {t('noReviewsYet')}
                        </div>
                    )}

                    {/* Add Review Card Action */}
                    <div
                        onClick={() => setIsFormOpen(true)}
                        style={{
                            minWidth: '300px',
                            scrollSnapAlign: 'start',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}
                        className="feedback-card"
                    >
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '50%', marginBottom: '1rem' }}>
                            <MessageCircle size={32} color="var(--primary)" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Write a Review</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Share your experience</p>
                    </div>
                </div>

                {/* Submission Modal */}
                {isFormOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2000,
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div className="glass-panel" style={{
                            background: 'var(--bg-primary)',
                            padding: '2.5rem',
                            width: '90%',
                            maxWidth: '500px',
                            position: 'relative',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={24} />
                            </button>

                            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textAlign: 'center' }}>{t('rateExperience')}</h3>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('howWasExperience')}</p>

                            {message && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                    background: message.includes('Thank') ? '#dcfce7' : '#fee2e2',
                                    color: message.includes('Thank') ? '#166534' : '#991b1b'
                                }}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setSubmission({ ...submission, rating: star })}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                transform: star <= submission.rating ? 'scale(1.1)' : 'scale(1)',
                                                transition: 'transform 0.2s'
                                            }}
                                        >
                                            <Star
                                                size={36}
                                                fill={star <= submission.rating ? "#eab308" : "none"}
                                                color={star <= submission.rating ? "#eab308" : "#cbd5e1"}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('yourReview')}</label>
                                    <textarea
                                        className="input-field"
                                        rows="4"
                                        placeholder={t('reviewPlaceholder')}
                                        value={submission.comment}
                                        onChange={e => setSubmission({ ...submission, comment: e.target.value })}
                                        required
                                        style={{ resize: 'none' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                                >
                                    {submitting ? t('submitting') : t('postReview')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeedbackSection;
