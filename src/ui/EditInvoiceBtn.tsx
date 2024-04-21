import { openFormPopUp } from "../features/invoicesSlice";
import { useInvoicesDispatch } from "../hooks";

function EditInvoiceBtn() {
  const dispatch = useInvoicesDispatch();

  const handleEditInvoice = () => {
    dispatch(openFormPopUp());
  };
  return (
    <button
      className="action-box-btn action-box-btn__edit-btn"
      onClick={handleEditInvoice}
    >
      Edit
    </button>
  );
}

export default EditInvoiceBtn;
