// src/components/CurrencySelector.jsx
import Dropdown from "../../ui/Dropdown";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useTranslation } from "react-i18next";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const { t } = useTranslation();

  const supportedCurrencies = ["USD", "EUR", "GBP", "AUD", "INR"].map(
    (code) => ({ value: code, label: t(`currency.${code}`) }),
  );

  return (
    <Dropdown
      value={currency}
      onChange={setCurrency}
      options={[
        { value: "", label: t("currency.select"), disabled: true }, // placeholder
        ...supportedCurrencies,
      ]}
      buttonClassName="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
      text-gray-700 dark:text-white rounded-lg px-4 py-2 shadow-sm 
      hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      dropdownClassName="rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
      bg-white dark:bg-gray-900"
      optionClassName="px-4 py-2 dark:hover:bg-(--brand-bg-secondary) 
      transition-colors"
    />
  );
}
