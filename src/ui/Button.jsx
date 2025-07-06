import React from "react";
import classNames from "classnames"; // optional, helps with conditional styles

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles = "px-4 py-2 rounded text-sm font-medium transition";

  const variants = {
    primary: "bg-yellow-500 text-white hover:bg-yellow-600",
    secondary:
      "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
    ghost: "text-gray-700 hover:text-yellow-500",
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
