import { useEffect, useRef, useState } from "react";
import { useInvoicesDispatch, useInvoicesSelector } from "../hooks";
import {
  addAppliedFilter,
  filterInvoiceList,
  filterType,
  removeAppliedFilter,
} from "../features/invoicesSlice";

const filterList: filterType[] = ["paid", "pending", "draft"];

import { motion, AnimatePresence } from "framer-motion";

const menuVariants = {
  initial: {
    x: "-50%",
    opacity: 0,
    scaleY: 0.5,
  },
  animate: {
    opacity: 1,
    scaleY: 1,
    transition: {
      ease: "linear",
      duration: 0.2,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0.5,
    transition: { ease: "linear", duration: 0.2, when: "afterChildren" },
  },
};
const menuItemVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { ease: "linear", duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { ease: "linear", duration: 0.1 },
  },
};

function StatusFilter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const divRef = useRef<null | HTMLDivElement>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenuOpen(event.target.checked);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="list-status-filter" ref={divRef}>
      <div className="filter-display-btn">
        <input
          type="checkbox"
          checked={isMenuOpen}
          onChange={handleCheckboxChange}
          name=""
          id="toogle-menu"
        />
        <label className="filter-display-btn__label" htmlFor="toogle-menu">
          <span className="label-text">
            Filter
            <span className="label-text--lg-screen"> by status</span>
          </span>
        </label>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="dropdowm-menu"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              originY: 0,
            }}
            transition={{
              ease: "linear",
              duration: 0.2,
            }}
          >
            <ul className="filter-list">
              {filterList.map((filter, index) => (
                <FilterListItem key={index} filter={filter} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StatusFilter;

type FilterListItemProps = {
  filter: filterType;
};

function FilterListItem({ filter }: FilterListItemProps) {
  const { appLiedFilters } = useInvoicesSelector((state) => state.invoicesData);
  const [isChecked, setIsChecked] = useState(appLiedFilters.includes(filter));

  const dispatch = useInvoicesDispatch();

  useEffect(() => {
    if (isChecked) {
      !appLiedFilters.includes(filter) && dispatch(addAppliedFilter(filter));
    } else {
      appLiedFilters.includes(filter) && dispatch(removeAppliedFilter(filter));
    }
    dispatch(filterInvoiceList());
  }, [isChecked, appLiedFilters, dispatch, filter]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  return (
    <motion.li className="filter-list__item" variants={menuItemVariants}>
      <input
        type="checkbox"
        name=""
        checked={isChecked}
        onChange={handleCheckboxChange}
        id={`invoice-status-${filter}`}
      />
      <label
        className="filter-display-btn__text"
        htmlFor={`invoice-status-${filter}`}
      >
        {filter}
      </label>
    </motion.li>
  );
}
