import { openDeletePopUp } from "@/features/invoicesSlice";
import { useInvoicesDispatch } from "@/hooks";
import { HiOutlineTrash } from "react-icons/hi";

function DeleteBtn() {
  const dispatch = useInvoicesDispatch();

  return (
    <button
      className="action-box-btn action-box-btn__delete-btn"
      onClick={() => dispatch(openDeletePopUp())}
    >
      <span className="icon">
        <HiOutlineTrash />
      </span>
      <span className="text">Delete</span>
    </button>
  );
}

export default DeleteBtn;
