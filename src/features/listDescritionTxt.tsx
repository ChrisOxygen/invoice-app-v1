import { useInvoicesSelector } from "../hooks";
import { Invoice } from "./invoicesSlice";

type ListDescriptionTxtProps = {
  invoiceList: Invoice[];
};

function ListDescriptionTxt({ invoiceList }: ListDescriptionTxtProps) {
  const { appLiedFilters } = useInvoicesSelector((state) => state.invoicesData);
  const filterActive = appLiedFilters.length > 0 && appLiedFilters.length < 3;

  const isSingular = invoiceList.length === 1;

  const getDisplayText = () => {
    return (
      <>
        <span className="list-description--lg-screen">There </span>
        <span className="list-description--lg-screen">
          {isSingular ? "is " : "are "}
        </span>
        {`${invoiceList.length} `}
        <span className="list-description--lg-screen">
          {!filterActive ? "total " : `${appLiedFilters.join(" and ")} `}
        </span>
        {isSingular ? "invoice" : "invoices"}
      </>
    );
  };

  if (invoiceList.length === 0) {
    return <span className="list-description">No invoices</span>;
  }

  return <span className="list-description">{getDisplayText()}</span>;
}

export default ListDescriptionTxt;
