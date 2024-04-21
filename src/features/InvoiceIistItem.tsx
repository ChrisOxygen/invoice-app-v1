import { formatCurrency, formatDate } from "../utils/helpers";
import { type Invoice } from "./invoicesSlice";

import { IoIosArrowForward } from "react-icons/io";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InvoiceStatus from "../components/InvoiceStatus";

const itemVariants = {
  initial: {
    opacity: 0,
    scaleY: 0.8,
    duration: 0.2,
  },
  animate: {
    opacity: 1,
    scaleY: 1,
    transition: { type: "spring", duration: 0.2 },
  },
  exit: {
    opacity: 0,
    scaleY: 0.8,
    transition: { type: "spring", duration: 0.2 },
  },
};

type InvoiceListItemProps = {
  invoice: Invoice;
};

function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  const dueDate = formatDate(invoice.paymentDue);
  const forMatedTotal = formatCurrency(invoice.total);
  return (
    <motion.li
      className="invoice"
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      style={{
        originY: 0,
      }}
    >
      <Link to={`/invoice/${invoice.id}`} className="invoice__link">
        <span className="invoice__id">
          <span className="invoice__id--hash">#</span>
          {invoice.id}
        </span>
        <span className="invoice__due-date">{`Due ${dueDate}`}</span>
        <span className="invoice__recipient-name">{invoice.clientName}</span>
        <span className=" invoice__amount">{forMatedTotal}</span>
        <InvoiceStatus status={invoice.status} position="listItem" />
        <span className="invoice__view-more-icon">
          <IoIosArrowForward />
        </span>
      </Link>
    </motion.li>
  );
}

export default InvoiceListItem;
