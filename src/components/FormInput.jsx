export default function FormInput({
  type = "text",
  placeholder,
  className = "",
  error,
  ...props
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        className={`border border-(--border-primary) text-(--text-secondary) dark:text-(--text-secondary) dark:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) 
          placeholder:text-(--text-muted) caret-(--text-muted) rounded-lg p-4 w-full ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
