function ThemeToggle({ toggleTheme, isDarkTheme }) {
  const icon = isDarkTheme ? "light_mode" : "dark_mode";
  return (
    <button
      className="flex items-center justify-center cursor-pointer py-3 px-3  dark:bg-gray-700 bg-gray-100 md:bg-transparent md:dark:bg-transparent text-white hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700"
      onClick={toggleTheme}
    >
      <span className="material-symbols-rounded text-gray-900 dark:text-white">
        {icon}
      </span>
    </button>
  );
}

export default ThemeToggle;
