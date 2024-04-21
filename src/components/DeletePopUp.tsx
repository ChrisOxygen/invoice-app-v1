import { closeDeletePopUp, deleteInvoice } from "@/features/invoicesSlice";
import { useInvoicesDispatch } from "@/hooks";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";

const transition = {
  ease: "circOut",
  duration: 0.3,
};

const backdropVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: transition,
    whern: "beforeChildren",
  },
  exit: {
    opacity: 0,
    transition: transition,
    when: "afterChildren",
  },
};

const popupVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { ...transition, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { ease: "circOut", duration: 0.3 },
  },
};

function DeletePopUp() {
  const divRef = useRef<null | HTMLDivElement>(null);
  const dispatch = useInvoicesDispatch();
  const navigate = useNavigate();
  const { id: idFromParams } = useParams();

  useEffect(() => {
    const handleCloseFormPopUp = () => {
      dispatch(closeDeletePopUp());
    };
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleCloseFormPopUp();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleDeleteBtnClick = () => {
    dispatch(deleteInvoice(idFromParams));
    dispatch(closeDeletePopUp());
    navigate(-1);
  };

  if (idFromParams === undefined) return null;
  return (
    <motion.div className="delete-alert-container">
      <motion.span
        className="delete-alert-backdrop"
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          originX: 0,
        }}
      ></motion.span>

      <motion.div
        ref={divRef}
        className="delete-alert-pop-up"
        variants={popupVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          originX: 0,
        }}
      >
        <h2 className="delete-alert-pop-up__heading">Confirm Deletion</h2>
        <p className="delete-alert-pop-up__text">
          Are you sure you want to delete invoice #{idFromParams}? This action
          cannot be undone.
        </p>
        <div className="delete-alert-pop-up__btn-container">
          <button
            className="btn btn--cancel"
            onClick={() => {
              dispatch(closeDeletePopUp());
            }}
          >
            Cancel
          </button>
          <button
            className="action-box-btn action-box-btn__delete-btn"
            onClick={handleDeleteBtnClick}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DeletePopUp;
