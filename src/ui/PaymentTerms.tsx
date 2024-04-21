import { useEffect, useRef, useState } from "react";

import { IoIosArrowDown } from "react-icons/io";

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

type PaymentTermsProps = {
  onChange: (paymentTermID: string) => void;
  selected: string | undefined;
};

const allPaymentTerms = [
  { numDays: 1, displayText: "Net 1 Day" },
  { numDays: 7, displayText: "Net 7 Days" },
  { numDays: 14, displayText: "Net 14 Days" },
  { numDays: 30, displayText: "Net 30 Days" },
];

function PaymentTerms({ onChange, selected: selectedTerm }: PaymentTermsProps) {
  const [paymentTerm, setPaymentTerm] = useState<number>(
    selectedTerm === undefined ? 14 : +selectedTerm
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const divRef = useRef<null | HTMLDivElement>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenuOpen(event.target.checked);
  };

  useEffect(() => {
    if (selectedTerm === undefined) {
      return;
    }
    setPaymentTerm(+selectedTerm);
  }, [selectedTerm]);

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

  const selectedPaymentTerm = allPaymentTerms.find(
    (term) => term.numDays === paymentTerm
  );

  const { displayText } = selectedPaymentTerm!;

  const handlePaymentTermChange = (paymentTermID: number) => {
    onChange(`${paymentTermID}`);
    setIsMenuOpen(false);
  };

  return (
    <div className="select-input" ref={divRef}>
      <div
        className={`select-input__display ${
          isMenuOpen && "select-input__display--focused"
        }`}
      >
        <input
          type="checkbox"
          id="toogle-dropdown"
          checked={isMenuOpen}
          onChange={handleCheckboxChange}
        />
        <label id="selected" htmlFor="toogle-dropdown">
          {displayText}
          <span className="arrow-icon">
            <IoIosArrowDown />
          </span>
        </label>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="select-input__dropdown"
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
            <ul className="select-options-list">
              {allPaymentTerms.map((term) => (
                <motion.li
                  key={term.numDays}
                  className="select-options-list__item select-option"
                  variants={menuItemVariants}
                  onClick={() => handlePaymentTermChange(term.numDays)}
                >
                  {term.displayText}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default PaymentTerms;
