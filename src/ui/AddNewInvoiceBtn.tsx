import { openFormPopUp } from "@/features/invoicesSlice";
import { useInvoicesDispatch } from "@/hooks";

function AddNewInvoiceBtn() {
  const dispatch = useInvoicesDispatch();

  const handleEditInvoice = () => {
    dispatch(openFormPopUp());
  };
  return (
    <button className="add-new" onClick={handleEditInvoice}>
      <div className="add-new__icon">
        <img src="/assets/icon-plus.svg" alt="" />
      </div>
      <span className="add-new__text">
        New <span className="add-new__text--lg-screen">Invoice</span>
      </span>
    </button>
  );
}

export default AddNewInvoiceBtn;
