import { IoIosArrowBack } from "react-icons/io";
import InvoiceStatus from "../components/InvoiceStatus";

import { useNavigate, useParams } from "react-router-dom";
import { useInvoicesDispatch, useInvoicesSelector } from "../hooks";
import { formatCurrency, formatDate } from "../utils/helpers";
import EditInvoiceBtn from "../ui/EditInvoiceBtn";
import { markAsPaid } from "@/features/invoicesSlice";
import DeleteBtn from "@/components/DeleteBtn";
import { useEffect, useRef } from "react";

function SingleInvoice() {
  const { id: idFromParams } = useParams();
  const { invoices } = useInvoicesSelector((state) => state.invoicesData);
  const navigate = useNavigate();

  const containerDivRef = useRef<null | HTMLDivElement>(null);
  const headerDivRef = useRef<null | HTMLDivElement>(null);

  const dispatch = useInvoicesDispatch();

  const handleMarkAsPaidBtnClick = () => {
    dispatch(markAsPaid(idFromParams));
  };

  const currentInvoice = invoices.find(
    (invoice) => invoice.id === idFromParams
  );

  useEffect(() => {
    function checkScrollbar() {
      const containerDiv = containerDivRef.current;
      const headerDiv = headerDivRef.current;
      if (!containerDiv || !headerDiv) return;
      if (containerDiv.scrollHeight > containerDiv.clientHeight) {
        containerDiv.classList.add("scroll-active");
        headerDiv.classList.add("pad-for-scroll");
      } else {
        containerDiv.classList.remove("scroll-active");
        headerDiv.classList.remove("pad-for-scroll");
      }
    }

    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, []);

  if (!currentInvoice) return null;

  const { senderAddress, clientAddress, items } = currentInvoice;

  return (
    <div className="single-invoice-container box-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <span className="back-btn__icon">
          <IoIosArrowBack />
        </span>
        <div className="back-btn__text">Go back</div>
      </button>
      <div className="header-section" ref={headerDivRef}>
        <div className="status-box">
          <span className="status-box__text">Status</span>
          <InvoiceStatus
            status={currentInvoice.status}
            position="singleInvoice"
          />
        </div>
        <div className="action-box action-box--lg-screen">
          {(currentInvoice.status === "pending" ||
            currentInvoice.status === "draft") && <EditInvoiceBtn />}

          <DeleteBtn />
          {currentInvoice.status === "pending" && (
            <button
              className="action-box-btn action-box-btn__mark-as-btn"
              onClick={handleMarkAsPaidBtnClick}
            >
              Mark as paid
            </button>
          )}
        </div>
      </div>
      <div className="bottom-fixed-tab ">
        <div className="bottom-fixed-tab__container">
          <div className="action-box action-box--sm-screen">
            {(currentInvoice.status === "pending" ||
              currentInvoice.status === "draft") && <EditInvoiceBtn />}
            <DeleteBtn />
            {currentInvoice.status === "pending" && (
              <button
                className="action-box-btn action-box-btn__mark-as-btn"
                onClick={handleMarkAsPaidBtnClick}
              >
                Mark as paid
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="scroll-bar-container" ref={containerDivRef}>
        <div className="body-section">
          <div className="contact-details">
            <div className="contact-details__top-section">
              <div className="invoice-id-project-desc">
                <span className="invoice-id-project-desc__id">
                  <span className="invoice-id-project-desc__hash">#</span>
                  <span className="invoice-id-project-desc__id-number">
                    {currentInvoice.id}
                  </span>
                </span>
                <span className="invoice-id-project-desc__project-desc">
                  {currentInvoice.description}
                </span>
              </div>
              <div className="senders-address">
                <span className="senders-address__street">
                  {senderAddress.street}
                </span>
                <span className="senders-address__city">
                  {senderAddress.city}
                </span>
                <span className="senders-address__post-code">
                  {senderAddress.postCode}
                </span>
                <span className="senders-address__country">
                  {senderAddress.country}
                </span>
              </div>
            </div>
            <div className="contact-details__bottom-section">
              <div className="dates-section">
                <div className="dates-section__invoice-date">
                  <span className="title">Invoice Date</span>
                  <span className="date secondary-bold">
                    {formatDate(currentInvoice.createdAt)}
                  </span>
                </div>
                <div className="dates-section__payment-date">
                  <span className="title">Payment Due</span>
                  <span className="date secondary-bold">
                    {formatDate(currentInvoice.paymentDue)}
                  </span>
                </div>
              </div>
              <div className="bill-section">
                <span className="title">Bill To</span>
                <div className="billing-details">
                  <h4 className="client-name secondary-bold">
                    {currentInvoice.clientName}
                  </h4>
                  <div className="clients-address">
                    <span className="clients-address__street">
                      {clientAddress.street}
                    </span>
                    <span className="clients-address__city">
                      {clientAddress.city}
                    </span>
                    <span className="clients-address__post-code">
                      {clientAddress.postCode}
                    </span>
                    <span className="clients-address__country">
                      {clientAddress.country}
                    </span>
                  </div>
                </div>
              </div>
              <div className="email-to-section">
                <span className="title">Sent to</span>
                <span className="email secondary-bold">
                  {currentInvoice.clientEmail}
                </span>
              </div>
            </div>
          </div>
          <div className="order-details">
            <div className="items-table">
              <div className="items-table__header table-grid">
                <span className="column column__item-name">Item Name</span>
                <span className="column column__qty">QTY.</span>
                <span className="column column__price">Price</span>
                <span className="column column__total">Total</span>
              </div>
              {items.map((item, index) => (
                <div key={index} className="items-table__row table-grid">
                  <span className="column column__item-name">
                    {item.name}
                    <span className="qty-amount-sm-screen">{`${
                      item.quantity
                    } x ${formatCurrency(item.price)}`}</span>
                  </span>
                  <span className="column column__qty">{item.quantity}</span>
                  <span className="column column__price">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="column column__total">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
            <div className="total-amount-box">
              <span className="total-amount-box__title">Amount Due</span>
              <h3 className="total-amount-box__amount">
                {formatCurrency(currentInvoice.total)}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleInvoice;
