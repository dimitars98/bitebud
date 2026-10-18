import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({ USD: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,AUD,INR,MKD"
        );
        const data = await res.json();
        // Response shape: { amount: 1, base: "USD", date: "...", rates: { EUR: 0.92, GBP: 0.78, ... } }
        setRates({ USD: 1, ...data.rates });
        setLoading(false);
        // console.log("Rates loaded:", { USD: 1, ...data.rates });
      } catch (err) {
        console.error("Failed to fetch rates", err);
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const formatCurrency = (amountInUSD) => {
    if (loading) return "..."; // guard until rates are ready

    const rate = rates[currency] || 1;
    const converted = amountInUSD * rate;

    if (currency === "INR") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(converted);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
