import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dracula") {
      document.documentElement.classList.add("dracula");
    } else {
      document.documentElement.classList.remove("dracula");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dracula" : "light")}
      className="p-2 rounded-lg border transition-all bg-gray-200 dark:bg-dracula-background text-black dark:text-dracula-white"
    >
      {theme === "light" ? "🧛 Dracula Mode" : "☀️ Light Mode"}
    </button>
  );
}
