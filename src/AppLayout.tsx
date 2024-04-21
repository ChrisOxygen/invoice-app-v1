import { Outlet } from "react-router-dom";
import SiteMenu from "./components/SIteMenu";

import { motion, AnimatePresence } from "framer-motion";

import InvioceForm from "./components/InvoiceForm";
import { useInvoicesSelector } from "./hooks";
import DeletePopUp from "./components/DeletePopUp";

function AppLayout() {
  const { isFormPopUpOpen: formPopUpOpen, isDeletePopUpOpen } =
    useInvoicesSelector((state) => state.invoicesData);

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
