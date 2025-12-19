import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EGP');
  const [exchangeRate] = useState(1); // 1 USD = 1 EGP for now, or just base currency

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: currency,
    }).format(price * exchangeRate);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
