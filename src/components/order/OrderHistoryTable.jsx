import {
  CheckCircle,
  Clock,
  XCircle,
  Loader,
  ListFilter,
  ChevronsUpDown,
} from "lucide-react";
import { useCurrency } from "../../contexts/CurrencyContext";
import Dropdown from "../../ui/Dropdown";
import { useMemo, useState } from "react";
import { sortBy } from "../../lib/sortBy";
import SortableTh from "../../ui/SortableTh";
import SelectDropdown from "../../ui/SelectDropdown";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../helpers/dates";

export default function OrderHistoryTable({ orders }) {
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPageOptions = [5, 10, 25];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter
      ? o.status === statusFilter.toLowerCase()
      : true;
    return matchesStatus;
  });

  const sortedOrders = useMemo(() => {
    if (!sortConfig.column) return filteredOrders;

    return sortBy(filteredOrders, sortConfig.column, sortConfig.direction);
  }, [filteredOrders, sortConfig]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedOrders.length);
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  const { formatCurrency } = useCurrency();
  const { t, i18n } = useTranslation();

  const filterOptions = [
    { value: "", label: t("history.chooseFilter"), disabled: true },
    { value: "Completed", label: t("orders.status.completed") },
    { value: "Delivering", label: t("orders.status.delivering") },
  ];

  function handleSort(column) {
    setSortConfig((prev) => {
      if (prev.column !== column) {
        // New column → start ascending
        return { column, direction: "asc" };
      }

      // Same column → toggle
      return {
        column,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
            {t("orders.status.completed")}
          </span>
        );
      case "delivering":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
            {t("orders.status.delivering")}
          </span>
        );
      case "failed":
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            {t("orders.status.failed")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
            {t(`orders.status.${status}`, { defaultValue: status })}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-lg dark:text-(--text-primary) font-semibold">
            {t("history.title")}
          </h2>
          <p className="text-sm text-gray-500">{t("history.subtitle")}</p>
        </div>
        <Dropdown
          icon={<ListFilter size={20} />}
          value={statusFilter}
          onChange={setStatusFilter}
          options={filterOptions}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <SortableTh
                label={t("history.colNumber")}
                column="orderNumber"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />

              <SortableTh
                label={t("history.colRestaurant")}
                column="restaurantName"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />

              <SortableTh
                label={t("history.colCustomer")}
                column="customerName"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />

              <SortableTh
                label={t("history.colStatus")}
                column="status"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />

              <SortableTh
                label={t("history.colEarnings")}
                column="courierEarning"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />

              <SortableTh
                label={t("history.colCompleted")}
                column="completedAt"
                sortConfig={sortConfig}
                onSort={handleSort}
                className="text-(--text-secondary) dark:text-(--text-secondary)"
              />
            </tr>
          </thead>

          <tbody className="divide-gray-200 dark:divide-gray-800">
            {sortedOrders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                  {/* {o.id.slice(0, 8)}… */}#{o.orderNumber}
                </td>

                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {o.restaurantName || "—"}
                </td>

                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {o.customerName || "—"}
                </td>

                <td className="px-6 py-4">{getStatusBadge(o.status)}</td>

                <td className="px-6 py-4 text-gray-900 dark:text-gray-200 font-semibold">
                  {o.courierEarning
                    ? formatCurrency(Number(o.courierEarning))
                    : "0.00"}
                </td>

                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {formatDateTime(o.completedAt, i18n.resolvedLanguage, "—")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            {t("history.empty")}
          </div>
        )}
      </div>
      {sortedOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-(--text-muted) dark:text-gray-300 mt-4 px-4">
          <div className="flex items-center gap-2 mb-5">
            <span>{t("history.perPage")}</span>
            <SelectDropdown
              value={itemsPerPage}
              onChange={(n) => {
                setItemsPerPage(n);
                setCurrentPage(1);
              }}
              options={itemsPerPageOptions}
              width="w-24"
              buttonClassName="bg-white dark:bg-(--brand-bg-secondary) text-(--text-primary) dark:text-(--text-muted) border border-(--border-primary)"
              optionClassName="text-(--text-primary) dark:text-(--text-muted)"
              activeOptionClassName="bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) dark:hover:bg-(--brand-bg-secondary-hover) text-(--text-muted)"
              selectedOptionClassName="font-bold text-yellow-900"
              listBoxOptionsClassName="bg-white dark:bg-(--brand-bg-secondary)"
            />
          </div>
          <div>
            {t("history.range", {
              from: startIndex + 1,
              to: endIndex,
              total: sortedOrders.length,
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-2 rounded-lg dark:bg-(--brand-bg-secondary) text-gray-200 
               dark:hover:bg-(--brand-bg-secondary-hover) hover:text-white disabled:opacity-50 
               flex items-center gap-1"
            >
              <span>←</span>
              <span className="hidden sm:inline">{t("history.previous")}</span>
            </button>

            <button
              disabled={endIndex >= sortedOrders.length}
              onClick={() =>
                setCurrentPage((p) =>
                  endIndex < sortedOrders.length ? p + 1 : p,
                )
              }
              className="px-3 py-2 rounded-lg dark:bg-(--brand-bg-secondary) text-gray-200 
               dark:hover:bg-(--brand-bg-secondary-hover) hover:text-white disabled:opacity-50 
               flex items-center gap-1"
            >
              <span className="hidden sm:inline">{t("history.next")}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
