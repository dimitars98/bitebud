import { ChevronsUpDown } from "lucide-react";

export default function SortableTh({
  label,
  column,
  sortConfig,
  onSort,
  className = "",
}) {
  const isActive = sortConfig.column === column;
  const isDesc = isActive && sortConfig.direction === "desc";

  return (
    <th className={`px-6 py-3 text-left font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-2 cursor-pointer select-none"
      >
        {label}
        <ChevronsUpDown
          size={16}
          className={`transition-transform transition-colors ${
            isActive ? "text-yellow-500" : "text-gray-400"
          } ${isDesc ? "rotate-180" : ""}`}
        />
      </button>
    </th>
  );
}
