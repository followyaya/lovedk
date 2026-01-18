import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EUR' | 'XOF';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amountInEur: number) => string;
  exchangeRates: { [key: string]: number };
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [rates, setRates] = useState<{ [key: string]: number }>({
    EUR: 1,
    USD: 1.09,
    XOF: 655.957,
  });

  useEffect(() => {
    // Fetch real-time rates based on EUR
    const fetchRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        setRates({
          EUR: 1,
          USD: data.rates.USD,
          XOF: data.rates.XOF || 655.957, // Fallback for XOF if not present
        });
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
      }
    };

    fetchRates();
  }, []);

  const getSymbol = (c: Currency) => {
    switch (c) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'XOF': return 'FCFA';
      default: return '€';
    }
  };

  const convert = (amountInEur: number) => {
    const rate = rates[currency] || 1;
    const converted = amountInEur * rate;
    
    if (currency === 'XOF') {
      return `${Math.ceil(converted).toLocaleString()} ${getSymbol(currency)}`;
    }
    
    return `${getSymbol(currency)}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      convert, 
      exchangeRates: rates,
      symbol: getSymbol(currency) 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
