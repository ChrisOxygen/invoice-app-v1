import { useEffect, useState } from "react";
import InvoiceListItem from "../features/InvoiceIistItem";
import ListDescriptionTxt from "../features/listDescritionTxt";
import { useInvoicesSelector } from "../hooks";
import AddNewInvoiceBtn from "../ui/AddNewInvoiceBtn";
import StatusFilter from "../ui/StatusFilter";

import { motion, AnimatePresence } from "framer-motion";
import EmptyListDisplay from "../components/EmptyLIstDisplay";

function Invoices() {
  const { invoices, filteredInvoices } = useInvoicesSelector(
    (state) => state.invoicesData
  );

  const [invoiceList, setInvoiceList] = useState(invoices);

  useEffect(() => {
    if (filteredInvoices.length === 0) {
      setInvoiceList(invoices);
    } else {
      setInvoiceList(filteredInvoices);
    }
  }, [filteredInvoices, invoices]);

  if (invoiceList.length === 0) return <EmptyListDisplay />;

  return (
    <div className="invoice-container box-container">
      <div className="header-section">
        <div className="title-container">
          <h3 className="title">Invoices</h3>
          <ListDescriptionTxt invoiceList={invoiceList} />
        </div>
        <StatusFilter />

        <AddNewInvoiceBtn />
      </div>

      <motion.ul
        className="invoice-list"
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ease: "linear", duration: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {invoiceList.map((invoice) => (
            <InvoiceListItem key={invoice.id} invoice={invoice} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

export default Invoices;
