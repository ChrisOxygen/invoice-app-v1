import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";

import { useEffect } from "react";
import { useInvoicesDispatch, useInvoicesSelector } from "../hooks";
import { setTheme } from "../features/invoicesSlice";

import { motion, AnimatePresence } from "framer-motion";

const iconVariants = {
  initial: { opacity: 0, transition: { duration: 0.3 } },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

function ThemeSwitcherBtn() {
  const { currentTheme } = useInvoicesSelector((state) => state.invoicesData);

  const dispatch = useInvoicesDispatch();

  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [currentTheme]);

  const handleThemeChange = () => {
    dispatch(setTheme());
  };

  return (
    <motion.button className="theme-switch" onClick={handleThemeChange}>
      <AnimatePresence mode="popLayout" initial={false}>
        {currentTheme === "dark" && (
          <motion.span
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <IoMdSunny />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence mode="popLayout" initial={false}>
        {currentTheme === "light" && (
          <motion.span
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <IoIosMoon />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default ThemeSwitcherBtn;
