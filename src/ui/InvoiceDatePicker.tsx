import { useEffect, useRef, useState } from "react";

import { BiCalendarAlt } from "react-icons/bi";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { convertDateISO, formatDatePicker } from "@/utils/helpers";

const menuVariants = {
  initial: {
    x: "",
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

type InvoiceDatePickerProps = {
  onChange: (paymentTermID: string) => void;
  selected: string | undefined;
};

function InvoiceDatePicker({ onChange, selected }: InvoiceDatePickerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    new Date(
      selected === undefined
        ? new Date().toString()
        : new Date(selected).toString()
    )
  );
  const [readAbleDate, setReadAbleDate] = useState<string | undefined>(
    selected === undefined || ""
      ? formatDatePicker(new Date())
      : formatDatePicker(new Date(selected))
  );
  const divRef = useRef<null | HTMLDivElement>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMenuOpen(event.target.checked);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setReadAbleDate(formatDatePicker(date!));

    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (date) {
      setReadAbleDate(formatDatePicker(date));
      onChange(convertDateISO(`${date}`));
    }
  }, [date, onChange]);

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
    <div className="date-input" ref={divRef}>
      <div
        className={`date-input__display ${
          isMenuOpen && "date-input__display--focused"
        }`}
      >
        <input
          type="checkbox"
          id="toogle-calender-box"
          checked={isMenuOpen}
          onChange={handleCheckboxChange}
        />
        <label id="selected" htmlFor="toogle-calender-box">
          {readAbleDate}
          <span className="arrow-icon">
            <BiCalendarAlt />
          </span>
        </label>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="date-input__calender-box"
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
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InvoiceDatePicker;
