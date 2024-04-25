import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInvoicesDispatch, useInvoicesSelector } from "../hooks";
import {
  Invoice,
  InvoiceItemType,
  closeFormPopUp,
  createInvoice,
  updateInvoice,
} from "../features/invoicesSlice";

import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  Controller,
  type FieldValues,
} from "react-hook-form";

import { IoMdTrash } from "react-icons/io";
import { useParams } from "react-router-dom";
import PaymentTerms from "../ui/PaymentTerms";
import InvoiceDatePicker from "../ui/InvoiceDatePicker";
import { generateUniqueId, sterilizeData } from "@/utils/helpers";
import { HiExclamationCircle } from "react-icons/hi";
import { ErrorMessage } from "@hookform/error-message";

type FormValues = {
  id: string;
  billFromStreetAddress: string;
  billFromCity: string;
  billFromPostCode: string;
  billFromCountry: string;
  billToClientName: string;
  billToClientEmail: string;
  billToStreetAddress: string;
  billToCity: string;
  billToPostCode: string;
  billToCountry: string;
  invoiceDate: string;
  paymentTerms: string;
  projectDescription: string;
  service: InvoiceItemType[];
};

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
    x: "-120%",
    scaleX: 0.8,
  },
  animate: {
    x: 0,
    scaleX: 1,
    transition: { ...transition, delay: 0.1 },
  },
  exit: {
    x: "-80%",
    scaleX: 0.8,
    transition: { ease: "circOut", duration: 0.3 },
  },
};

function InvioceForm() {
  const divRef = useRef<null | HTMLDivElement>(null);
  const { id: idFromParams } = useParams();
  const { invoices } = useInvoicesSelector((state) => state.invoicesData);
  const idArray = invoices.map((invoice) => invoice.id);

  const methods = useForm<FormValues>({
    defaultValues: {
      service: [
        {
          name: "",
          quantity: 0,
          price: 0,
          total: 0,
        },
      ],
    },
    mode: "onBlur",
  });
  const {
    register,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = methods;

  const { fields, append, remove, replace } = useFieldArray({
    name: "service",
    control,
    rules: {
      required: "This field is required",
    },
  });

  const dispatch = useInvoicesDispatch();

  useEffect(() => {
    function getInvoiceValues() {
      if (idFromParams) {
        const currentInvoice = invoices.find(
          (invoice) => invoice.id === idFromParams
        );

        if (!currentInvoice) return;

        const {
          senderAddress,
          clientAddress,
          items,
          paymentDue,
          description,
          paymentTerms,
          clientName,
          clientEmail,
        } = currentInvoice;

        const current = {
          id: idFromParams,
          billFromStreetAddress: senderAddress.street,
          billFromCity: senderAddress.city,
          billFromPostCode: senderAddress.postCode,
          billFromCountry: senderAddress.country,
          billToClientName: clientName,
          billToClientEmail: clientEmail,
          billToStreetAddress: clientAddress.street,
          billToCity: clientAddress.city,
          billToPostCode: clientAddress.postCode,
          billToCountry: clientAddress.country,
          invoiceDate: paymentDue,
          paymentTerms: paymentTerms.toString(),
          projectDescription: description,
          service: items,
        };

        Object.entries(current).forEach(([key, value]) => {
          if (key === "service") {
            replace([...(value as InvoiceItemType[])]);
          }
          setValue(key as keyof FormValues, value);
        });

        reset({}, { keepValues: true });
      }
    }

    getInvoiceValues();
  }, [idFromParams, reset, replace, setValue, invoices]);

  useEffect(() => {
    const handleCloseFormPopUp = () => {
      dispatch(closeFormPopUp());
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

  const formTitle = () => {
    if (!idFromParams) return <span>New Invoice</span>;
    return (
      <span>
        Edit <span className="id-hash">#</span>
        {idFromParams}
      </span>
    );
  };

  return (
    <motion.div className="form-container">
      <motion.span
        className="form-backdrop"
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
        className="form-pop-up"
        variants={popupVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          originX: 0,
        }}
      >
        <FormProvider {...methods}>
          <div className="scroll-bar-container">
            <div className="form-content">
              <h3 className="form-title">{formTitle()}</h3>
              <form action="" className="form">
                <input type="text" {...register("id")} hidden />
                <div className="bill-from-section form-section">
                  <span className="bill-from-section__title section-title">
                    Bill From
                  </span>
                  <div className="bill-from-section__fields section-field">
                    <div className="form-row form-row--1">
                      <div className="input-box">
                        <label htmlFor="street-address">Street Address</label>
                        <input
                          className={`${
                            errors.billFromStreetAddress && "has-error"
                          }`}
                          type="text"
                          id="street-address"
                          {...register("billFromStreetAddress", {
                            required: "This field is required",
                          })}
                        />
                        {errors.billFromStreetAddress && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billFromStreetAddress.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-row form-row--2">
                      <div className="input-box">
                        <label htmlFor="city">City</label>
                        <input
                          className={`${errors.billFromCity && "has-error"}`}
                          type="text"
                          id="city"
                          {...register("billFromCity", {
                            required: "Required",
                          })}
                        />
                        {errors.billFromCity && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billFromCity.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="post-code">Post Code</label>
                        <input
                          className={`${
                            errors.billFromPostCode && "has-error"
                          }`}
                          type="text"
                          id="post-code"
                          {...register("billFromPostCode", {
                            required: "Required",
                          })}
                        />
                        {errors.billFromPostCode && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billFromPostCode.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="country">Country</label>
                        <input
                          className={`${errors.billFromCountry && "has-error"}`}
                          type="text"
                          id="country"
                          {...register("billFromCountry", {
                            required: "Required",
                          })}
                        />
                        {errors.billFromCountry && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billFromCountry.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bill-to-section form-section">
                  <span className="bill-to-section__title section-title">
                    Bill To
                  </span>
                  <div className="bill-to-section__fields section-field">
                    <div className="form-row form-row--1">
                      <div className="input-box">
                        <label htmlFor="client-name">Client's Name</label>
                        <input
                          className={`${
                            errors.billToClientName && "has-error"
                          }`}
                          type="text"
                          id="client-name"
                          {...register("billToClientName", {
                            required: "This field is required",
                          })}
                        />
                        {errors.billToClientName && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToClientName.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="client-email">Client's Email</label>
                        <input
                          className={`${
                            errors.billToClientEmail && "has-error"
                          }`}
                          type="email"
                          id="client-email"
                          {...register("billToClientEmail", {
                            required: "This field is required",
                            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          })}
                        />
                        {errors.billToClientEmail && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToClientEmail.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="street-address">Street Address</label>
                        <input
                          className={`${
                            errors.billToStreetAddress && "has-error"
                          }`}
                          type="text"
                          id="street-address"
                          {...register("billToStreetAddress", {
                            required: "This field is required",
                          })}
                        />
                        {errors.billToStreetAddress && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToStreetAddress.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-row form-row--2">
                      <div className="input-box">
                        <label htmlFor="city">City</label>
                        <input
                          className={`${errors.billToCity && "has-error"}`}
                          type="text"
                          id="city"
                          {...register("billToCity", {
                            required: "Required",
                          })}
                        />
                        {errors.billToCity && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToCity.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="post-code">Post Code</label>
                        <input
                          className={`${errors.billToPostCode && "has-error"}`}
                          type="text"
                          id="post-code"
                          {...register("billToPostCode", {
                            required: "Required",
                          })}
                        />
                        {errors.billToPostCode && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToPostCode.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="input-box">
                        <label htmlFor="country">Country</label>
                        <input
                          className={`${errors.billToCountry && "has-error"}`}
                          type="text"
                          id="country"
                          {...register("billToCountry", {
                            required: "Required",
                          })}
                        />
                        {errors.billToCountry && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.billToCountry.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-row form-row--3">
                      <div
                        className={`input-box date-input-box ${
                          errors.invoiceDate && "date-input-box--has-error"
                        }`}
                      >
                        <label htmlFor="invoice-date">Invoice Date</label>
                        <Controller
                          control={control}
                          name="invoiceDate"
                          render={({ field: { onChange, value } }) => (
                            <InvoiceDatePicker
                              onChange={onChange}
                              selected={value}
                            />
                          )}
                        />
                        {errors.invoiceDate && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.invoiceDate.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                      <div
                        className={`input-box payment-term-input-box ${
                          errors.paymentTerms &&
                          "payment-term-input-box--has-error"
                        }`}
                      >
                        <label htmlFor="payment-terms">Payment Terms</label>
                        <Controller
                          rules={{
                            required: "Required",
                          }}
                          control={control}
                          name="paymentTerms"
                          render={({ field: { onChange, value } }) => (
                            <PaymentTerms
                              onChange={onChange}
                              selected={value}
                            />
                          )}
                        />
                        {errors.paymentTerms && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.paymentTerms.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="form-row form-row--4">
                      <div className="input-box">
                        <label htmlFor="project-description">
                          Project Description
                        </label>
                        <input
                          className={`${
                            errors.projectDescription && "has-error"
                          }`}
                          type="text"
                          id="project-description"
                          {...register("projectDescription", {
                            required: "This field is required",
                          })}
                        />
                        {errors.projectDescription && (
                          <span className="error">
                            <span className="error__txt">
                              {errors.projectDescription.message}
                            </span>
                            <span className="error__icon">
                              <HiExclamationCircle />
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="items-list-section form-section">
                  <span className="items-list-section__title section-title">
                    Item List
                  </span>
                  <div className="items-list-section__table">
                    <div className="table-body">
                      {fields.map((field, index) => {
                        return (
                          <div className="table-item table-row" key={field.id}>
                            <span className="table-item__item-name col col--item-name">
                              <label>Item Name</label>
                              <input
                                type="text"
                                {...register(`service.${index}.name` as const, {
                                  required: "Required",
                                })}
                              />
                              <ErrorMessage
                                errors={errors}
                                name={`service.${index}.name`}
                                render={() => <span className="error"></span>}
                              />
                            </span>
                            <span className="table-item__quantity col col--quantity">
                              <label>Qty.</label>
                              <input
                                type="number"
                                {...register(
                                  `service.${index}.quantity` as const,
                                  {
                                    valueAsNumber: true,
                                    required: "This field is required",
                                    onChange(event) {
                                      const quantity = +event.target.value;
                                      const price = getValues(
                                        `service.${index}.price` || 0
                                      );
                                      setValue(
                                        `service.${index}.total`,
                                        quantity * price
                                      );
                                    },
                                  }
                                )}
                              />
                              <ErrorMessage
                                errors={errors}
                                name={`service.${index}.quantity`}
                                render={() => <span className="error"></span>}
                              />
                            </span>
                            <span className="table-item__price col col--price">
                              <label>Price</label>
                              <input
                                className={`${
                                  errors[
                                    `service.${index}.price` as keyof FormValues
                                  ] && "has-error"
                                }`}
                                type="number"
                                {...register(
                                  `service.${index}.price` as const,
                                  {
                                    valueAsNumber: true,
                                    required: "This field is required",
                                    onChange(event) {
                                      const price = +event.target.value;
                                      const quantity = getValues(
                                        `service.${index}.quantity` || 0
                                      );
                                      setValue(
                                        `service.${index}.total`,
                                        quantity * price
                                      );
                                    },
                                  }
                                )}
                              />
                              <ErrorMessage
                                errors={errors}
                                name={`service.${index}.price`}
                                render={() => <span className="error"></span>}
                              />
                            </span>
                            <span className="table-item__total col col--total">
                              <label>Total</label>
                              <input
                                type="number"
                                readOnly
                                {...register(
                                  `service.${index}.total` as const,
                                  {
                                    valueAsNumber: true,
                                    required: "This field is required",
                                  }
                                )}
                              />
                            </span>
                            <button
                              className="trash-item col col--trash-item"
                              onClick={() => remove(index)}
                            >
                              <IoMdTrash />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="add-item-btn"
                      onClick={(e) => {
                        e.preventDefault();

                        append({
                          name: "",
                          quantity: 0,
                          price: 0,
                          total: 0,
                        });
                      }}
                    >
                      + Add New Item
                    </button>
                    <ErrorMessage
                      errors={errors}
                      name={`service.root`}
                      render={() => (
                        <span className="error">An item must be added</span>
                      )}
                    />
                    {Object.keys(errors).length !== 0 && (
                      <span className="error">All fields must be added</span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="form-controls">
            <div className="form-controls__left-container">
              <CancelBtn
                dispatch={dispatch}
                invoiceState={idFromParams ? "edit" : "create"}
              />
            </div>
            <div className="form-controls__right-container">
              <SaveAsDraftBtn
                dispatch={dispatch}
                invoiceState={idFromParams ? "edit" : "create"}
                idArray={idArray}
              />
              <SaveAndSendBtn
                dispatch={dispatch}
                invoiceState={idFromParams ? "edit" : "create"}
                isFormDirty={isDirty}
                idArray={idArray}
              />
            </div>
          </div>
        </FormProvider>
      </motion.div>
    </motion.div>
  );
}

export default InvioceForm;

type CancelBtnProps = {
  dispatch: ReturnType<typeof useInvoicesDispatch>;
  invoiceState: "create" | "edit";
};

type SaveAsDraftBtnProps = CancelBtnProps & {
  idArray: string[];
};
type SaveAndSendBtnProps = SaveAsDraftBtnProps & { isFormDirty: boolean };

function CancelBtn({ dispatch, invoiceState }: CancelBtnProps) {
  function handleClick() {
    dispatch(closeFormPopUp());
  }
  return (
    <button className="btn btn--cancel" onClick={handleClick}>
      {`${invoiceState === "edit" ? "Cancel" : "Discard"}`}
    </button>
  );
}

function SaveAsDraftBtn({
  dispatch,
  invoiceState,
  idArray,
}: SaveAsDraftBtnProps) {
  const { getValues, setValue } = useFormContext();
  const inVoiceStatus = getValues("status");
  function handleClick() {
    if (invoiceState === "create") {
      setValue("id", generateUniqueId(idArray));
    }

    const data: Invoice = sterilizeData(getValues(), "draft");

    dispatch(updateInvoice(data));
    dispatch(closeFormPopUp());
  }
  return (
    <button className="btn btn--save-draft" onClick={handleClick}>{`${
      invoiceState === "edit" && inVoiceStatus === "pending"
        ? "Save"
        : "Save as Draft"
    }`}</button>
  );
}
function SaveAndSendBtn({
  dispatch,
  isFormDirty,
  idArray,
  invoiceState,
}: SaveAndSendBtnProps) {
  const { handleSubmit, setValue } = useFormContext();
  const onSubmit = (data: FieldValues) => {
    const cleanData: Invoice = sterilizeData(data, "pending");
    if (invoiceState === "create") {
      dispatch(createInvoice(cleanData));
    } else {
      dispatch(updateInvoice(cleanData));
    }

    dispatch(closeFormPopUp());

    //send email to client
  };

  function handleClick() {
    if (invoiceState === "create") {
      setValue("id", generateUniqueId(idArray));
    }
    handleSubmit(onSubmit)();
  }
  console.log(isFormDirty, invoiceState);
  return (
    <button className="btn btn--save-send" onClick={handleClick}>
      {`${isFormDirty || invoiceState === "create" ? "Save & Send" : "Send"}`}
    </button>
  );
}
