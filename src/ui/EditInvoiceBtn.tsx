import { HiOutlinePencilSquare } from "react-icons/hi2";
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
      <span className="icon">
        <HiOutlinePencilSquare />
      </span>
      <span className="text">Edit</span>
    </button>
  );
}

export default EditInvoiceBtn;
