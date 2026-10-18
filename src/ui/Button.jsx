import classNames from "classnames";

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles = "px-4 py-2 rounded text-sm font-medium transition";

  const variants = {
    primary: "bg-(--brand-primary) text-white hover:bg-(--brand-hover)",
    secondary:
      "border border-(--brand-primary) text-(--brand-primary) hover:bg-(--brand-primary) hover:text-white",
    ghost: "text-gray-700 hover:text-(--brand-primary)",
  };

  return (
    <button
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
