import { forwardRef } from "react";

const FloatingInput = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      error,

      /* color + style tokens */
      borderClass = "border-gray-300 dark:border-[#2A2F3A]",
      focusBorderClass = "focus:border-indigo-500",
      focusRingClass = "focus:ring-indigo-500/20",
      labelClass = "text-gray-500 dark:text-gray-400",
      focusLabelClass = "peer-focus:text-indigo-500",

      className = "",
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder=" "
          className={`
            peer w-full px-4 pt-5 pb-2 rounded-lg
            bg-white dark:bg-[#0B1220]
            text-gray-900 dark:text-gray-100
            border transition
            focus:outline-none focus:ring-2
            ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : borderClass
            }
            ${!hasError && focusBorderClass}
            ${!hasError && focusRingClass}
            ${className}
          `}
          {...props}
        />

        <label
          htmlFor={id}
          className={`
            absolute left-4 top-1/2 -translate-y-1/2
            text-sm pointer-events-none
            transition-all duration-200 ease-out
            ${hasError ? "text-red-500" : labelClass}
            peer-focus:top-2 peer-focus:text-xs
            peer-[:not(:placeholder-shown)]:top-2
            peer-[:not(:placeholder-shown)]:text-xs
            ${!hasError && focusLabelClass}
          `}
        >
          {label}
        </label>

        {hasError && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
