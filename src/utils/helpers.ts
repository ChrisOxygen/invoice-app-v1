import { Invoice, InvoiceItemType } from "@/features/invoicesSlice";
import { addDays } from "date-fns";
import { FieldValues } from "react-hook-form";

export function formatDate(paymentDue: string) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(paymentDue);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(total)
    .split("")
    .map((char) => (char === "$" ? "$ " : char))
    .join("");
}

export function formatDatePicker(date: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function convertDateISO(fullDateString: string) {
  const date = new Date(fullDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function generateUniqueId(ids: string[]) {
  let newId;

  do {
    newId =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  } while (ids.includes(newId));

  return newId;
}

export function sterilizeData(
  data: FieldValues,
  status: "draft" | "pending"
): Invoice {
  if (data.invoiceDate && data.paymentTerms) {
    const result = addDays(new Date(data.invoiceDate), +data.paymentTerms);
    data.paymentDue = convertDateISO(`${result}`);
  } else {
    data.paymentDue = "";
  }

  data.clientAddress = {
    street: data.billToStreetAddress,
    city: data.billToCity,
    postCode: data.billToPostCode,
    country: data.billToCountry,
  };
  data.senderAddress = {
    street: data.billFromStreetAddress,
    city: data.billFromCity,
    postCode: data.billFromPostCode,
    country: data.billFromCountry,
  };
  data.clientName = data.billToClientName;
  data.clientEmail = data.billToClientEmail;
  data.createdAt = data.invoiceDate;
  data.paymentTerms = +data.paymentTerms;
  data.items = data.service;
  data.description = data.projectDescription;
  data.status = status;

  data.total = data.service.reduce(
    (acc: number, item: InvoiceItemType) => acc + item.total,
    0
  );

  Object.entries(data).forEach(([key]) => {
    if (key.includes("billFrom") || key.includes("billTo")) {
      delete data[key];
    }
  });
  delete data.service;
  delete data.invoiceDate;
  delete data.projectDescription;

  console.log(data);
  return data as Invoice;
}
