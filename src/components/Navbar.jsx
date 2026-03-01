import { FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow dark:bg-gray-800 dark:text-white">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <button onClick={toggleDark}>
        {dark ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default Navbar;