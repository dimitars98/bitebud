// A single number with an icon and a label, used on the partner and courier dashboards.
export default function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-(--brand-bg-secondary) rounded-xl shadow-sm p-6 flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-gray-500 dark:text-(--text-muted)">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-(--text-primary)">
          {value}
        </p>
      </div>
    </div>
  );
}
