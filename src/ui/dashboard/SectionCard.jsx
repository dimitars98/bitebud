// A titled panel with an icon, used to group content on the dashboards.
export default function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-(--brand-bg-primary) rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-(--text-primary)">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
