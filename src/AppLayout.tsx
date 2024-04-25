import { Outlet } from "react-router-dom";
import SiteMenu from "./components/SIteMenu";

import { motion, AnimatePresence } from "framer-motion";

import InvioceForm from "./components/InvoiceForm";
import { useInvoicesSelector } from "./hooks";
import DeletePopUp from "./components/DeletePopUp";
import { useEffect } from "react";

function AppLayout() {
  const { isFormPopUpOpen: formPopUpOpen, isDeletePopUpOpen } =
    useInvoicesSelector((state) => state.invoicesData);

  useEffect(() => {
    function checkScrollbar() {
      const formContainer = document.querySelector(".scroll-bar-container");
      const headerDiv = document.querySelector(".header-for-scrollbar");
      const formControlsDiv = document.querySelector(".form-controls");
      if (!formContainer) return;
      if (formContainer.scrollHeight > formContainer.clientHeight) {
        formContainer.classList.add("scroll-active");
        if (formControlsDiv) {
          formControlsDiv.classList.add("scroll");
        }
        if (headerDiv) {
          headerDiv.classList.add("pad-for-scroll");
        }
      } else {
        formContainer.classList.remove("scroll-active");
        if (formControlsDiv) {
          formControlsDiv.classList.remove("scroll");
        }
        if (headerDiv) {
          headerDiv.classList.remove("pad-for-scroll");
        }
      }
    }

    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, []);

  return (
    <motion.div className="wrapper" transition={{ duration: 0.2 }}>
      <AnimatePresence>{formPopUpOpen && <InvioceForm />}</AnimatePresence>
      <AnimatePresence>{isDeletePopUpOpen && <DeletePopUp />}</AnimatePresence>
      <SiteMenu />
      <Outlet />
    </motion.div>
  );
}
export default AppLayout;
