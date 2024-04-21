import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

import { AppDispatch, RootState } from "./store.ts";

type DispatchFunction = () => AppDispatch;

export const useInvoicesDispatch: DispatchFunction = useDispatch;
export const useInvoicesSelector: TypedUseSelectorHook<RootState> = useSelector;
