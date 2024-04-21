import { createSlice } from "@reduxjs/toolkit";
import invoices from "../../data.json";

type SenderAddressType = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

type ClientAddressType = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type InvoiceItemType = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type Invoice = {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: string;
  senderAddress: SenderAddressType;
  clientAddress: ClientAddressType;
  items: InvoiceItemType[];
  total: number;
};

export type filterType = "draft" | "pending" | "paid";

const initialState = {
  invoices: invoices as Invoice[],
  filteredInvoices: [] as Invoice[],
  currentTheme:
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? ("dark" as "light" | "dark")
      : ("light" as "light" | "dark"),

  appLiedFilters: [] as filterType[],
  isFormPopUpOpen: false,
  isDeletePopUpOpen: false,
};

export const invoicesSlice = createSlice({
  name: "invoicesData",
  initialState,
  reducers: {
    setTheme: (state) => {
      state.currentTheme = state.currentTheme === "dark" ? "light" : "dark";
    },
    addAppliedFilter: (state, action) => {
      state.appLiedFilters = [...state.appLiedFilters, action.payload];
    },
    removeAppliedFilter: (state, action) => {
      state.appLiedFilters = state.appLiedFilters.filter(
        (filter) => filter !== action.payload
      );
    },
    filterInvoiceList: (state) => {
      state.filteredInvoices = state.invoices.filter((invoice) =>
        state.appLiedFilters.includes(invoice.status as filterType)
      );
    },

    openFormPopUp: (state) => {
      state.isFormPopUpOpen = true;
    },
    closeFormPopUp: (state) => {
      state.isFormPopUpOpen = false;
    },
    createInvoice: (state, action) => {
      state.invoices = [...state.invoices, action.payload];
    },
    updateInvoice: (state, action) => {
      state.invoices = state.invoices.map((invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
    },
    markAsPaid: (state, action) => {
      state.invoices = state.invoices.map((invoice) =>
        invoice.id === action.payload ? { ...invoice, status: "paid" } : invoice
      );
    },
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload
      );
    },

    openDeletePopUp: (state) => {
      state.isDeletePopUpOpen = true;
    },
    closeDeletePopUp: (state) => {
      state.isDeletePopUpOpen = false;
    },
  },
});

export const {
  setTheme,
  addAppliedFilter,
  removeAppliedFilter,
  filterInvoiceList,
  openFormPopUp,
  closeFormPopUp,
  createInvoice,
  updateInvoice,
  markAsPaid,
  deleteInvoice,
  openDeletePopUp,
  closeDeletePopUp,
} = invoicesSlice.actions;
