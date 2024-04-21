type InvoiceStatusProps = {
  status: string;
  position: "listItem" | "singleInvoice";
};

function InvoiceStatus({ status, position }: InvoiceStatusProps) {
  return (
    <div
      className={`invoice-status invoice-status--${status} invoice-status--${position}`}
    >
      <span className="invoice-status__bg"></span>
      <span className="invoice-status__icon"></span>
      <span className="invoice-status__text">{status}</span>
    </div>
  );
}

export default InvoiceStatus;
