import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
        document.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

const translations = {
    en: {
        // Banner
        "freeShippingUnlocked": "Free Shipping Unlocked!",
        "freeShippingOver": "Free Shipping over",
        "addMore": "Add",
        "moreForFree": "more",

        // Header
        "searchPlaceholder": "Search products...",
        "manageAccount": "Manage Account",
        "orders": "Orders",
        "signOut": "Sign Out",
        "signIn": "Sign In",

        // Cart
        "cart": "Cart",
        "checkout": "Checkout",
        "subtotal": "Subtotal",
        "shipping": "Shipping",
        "total": "Total",
        "completeOrder": "Complete Order",
        "free": "FREE",
        "returnToCart": "Return to cart",
        "contact": "Contact",
        "shippingAddress": "Shipping Address",
        "shippingMethod": "Shipping Method",
        "payment": "Payment",
        "cod": "Cash on Delivery (COD)",
        "firstName": "First name",
        "lastName": "Last name",
        "address": "Address",
        "region": "Region",
        "city": "City",
        "phone": "Phone",
        "standard": "Standard",

        // Login & Auth
        "welcomeBack": "Welcome Back",
        "email": "Email",
        "password": "Password",
        "forgotPassword": "Forgot Password?",
        "signInButton": "Sign In",
        "or": "or",
        "newToNaqsha": "New to Naqsha?",
        "createAccount": "Create account",
        "pleaseLoginToViewProfile": "Please log in to view profile.",
        "googleLoginFailed": "Google Login Failed",

        // Profile
        "editProfile": "Edit Profile",
        "myOrders": "My Orders",
        "saveChanges": "Save Changes",
        "profileUpdatedSuccess": "Profile Updated Successfully!",
        "updateFailed": "Update failed",
        "noOrders": "No orders found yet.",
        "order": "Order",
        "processing": "Processing",
        "delivered": "Delivered",
        "more": "more", // e.g. +2 more

        // Product & Home
        "trendingNow": "Trending Now",
        "offer": "Limited Offer",
        "add": "Add",
        "added": "Added",
        "addToCartNotification": "Added to cart",

        // Hero
        "ramadanOffer": "Ramadan Offer",
        "endsIn": "Ends in",
        "exploreCollection": "Explore Collection",
        "seeReviews": "See Reviews",
        "reviews": "Reviews",

        // Reviews
        "customerReviews": "Voices of Naqsha",
        "joinSatisified": "Join hundreds of satisfied customers decorating their homes.",
        "writeReview": "Write a Review",
        "shareExperience": "Share your experience",
        "rateExperience": "Rate your experience",
        "howWasExperience": "How was your shopping experience?",
        "yourReview": "Your Review",
        "reviewPlaceholder": "What did you like? What can we improve?",
        "postReview": "Post Review",
        "submitting": "Submitting...",
        "noReviewsYet": "No reviews yet. Be the first to start the conversation!",
        "verifiedCustomer": "Verified Customer",
    },
    ar: {
        // Banner
        "freeShippingUnlocked": "تم فتح الشحن المجاني!",
        "freeShippingOver": "شحن مجاني للطلبات فوق",
        "addMore": "أضف",
        "moreForFree": "للحصول على الشحن المجاني",

        // Header
        "searchPlaceholder": "ابحث عن المنتجات...",
        "manageAccount": "إدارة الحساب",
        "orders": "الطلبات",
        "signOut": "تسجيل الخروج",
        "signIn": "تسجيل الدخول",

        // Cart
        "cart": "عربة التسوق",
        "checkout": "الدفع",
        "subtotal": "المجموع الفرعي",
        "shipping": "الشحن",
        "total": "الإجمالي",
        "completeOrder": "إتمام الطلب",
        "free": "مجاني",
        "returnToCart": "العودة للعربة",
        "contact": "بيانات الاتصال",
        "shippingAddress": "عنوان الشحن",
        "shippingMethod": "طريقة الشحن",
        "payment": "الدفع",
        "cod": "الدفع عند الاستلام",
        "firstName": "الاسم الأول",
        "lastName": "اسم العائلة",
        "address": "العنوان",
        "region": "المنطقة",
        "city": "المدينة",
        "phone": "رقم الهاتف",
        "standard": "قياسي",

        // Login & Auth
        "welcomeBack": "مرحباً بعودتك",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "forgotPassword": "نسيت كلمة المرور؟",
        "signInButton": "تسجيل الدخول",
        "or": "أو",
        "newToNaqsha": "جديد في ناقشة؟",
        "createAccount": "إنشاء حساب",
        "pleaseLoginToViewProfile": "يرجى تسجيل الدخول لعرض الملف الشخصي",
        "googleLoginFailed": "فشل تسجيل الدخول عبر Google",

        // Profile
        "editProfile": "تعديل الملف الشخصي",
        "myOrders": "طلباتي",
        "saveChanges": "حفظ التغييرات",
        "profileUpdatedSuccess": "تم تحديث الملف الشخصي بنجاح!",
        "updateFailed": "فشل التحديث",
        "noOrders": "لا توجد طلبات بعد.",
        "order": "طلب",
        "processing": "قيد المعالجة",
        "delivered": "تم التوصيل",
        "more": "المزيد",

        // Product & Home
        "trendingNow": "الأكثر رواجاً",
        "offer": "عرض محدود",
        "add": "أضف",
        "added": "تمت الإضافة",
        "addToCartNotification": "تمت الإضافة إلى العربة",

        // Hero
        "ramadanOffer": "عرض رمضان",
        "endsIn": "ينتهي في",
        "exploreCollection": "تصفح المجموعة",
        "seeReviews": "شاهد التقييمات",
        "reviews": "التقييمات",

        // Reviews
        "customerReviews": "اراء عملائنا",
        "joinSatisified": "انضم لمئات العملاء السعداء بتزيين منازلهم مع نقشة.",
        "writeReview": "اكتب رأيك",
        "shareExperience": "شارك تجربتك",
        "rateExperience": "قيم تجربتك",
        "howWasExperience": "كيف كانت تجربة التسوق؟",
        "yourReview": "رأيك",
        "reviewPlaceholder": "ماذا أعجبك؟ ماذا يمكننا تحسينه؟",
        "postReview": "نشر الرأي",
        "submitting": "جاري الإرسال...",
        "noReviewsYet": "لا توجد آراء بعد. كن أول من يبدأ المحادثة!",
        "verifiedCustomer": "عميل موثق",
    }
};
