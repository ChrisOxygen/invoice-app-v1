import { openDeletePopUp } from "@/features/invoicesSlice";
import { useInvoicesDispatch } from "@/hooks";

function DeleteBtn() {
  const dispatch = useInvoicesDispatch();

  return (
    <button
      className="action-box-btn action-box-btn__delete-btn"
      onClick={() => dispatch(openDeletePopUp())}
    >
      Delete
    </button>
  );
}

export default DeleteBtn;
