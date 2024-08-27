import {
  SET_PRIMARY_INVOICE_ADDRESS_SUCCESS,
  SET_PRIMARY_INVOICE_ADDRESS_FAILED,
  SET_PRIMARY_INVOICE_ADDRESS_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  SetPrimaryInvoiceAddrressSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_PRIMARY_INVOICE_ADDRESS_SUCCESS:
      return {
        SetPrimaryInvoiceAddrressSuccess: true,
        data: action.payload,
        loader: false,
      };
    case SET_PRIMARY_INVOICE_ADDRESS_LOADER:
      return {
        SetPrimaryInvoiceAddrressSuccess: false,
        data: [],
        loader: true,
      };
    case SET_PRIMARY_INVOICE_ADDRESS_FAILED:
      return {
        SetPrimaryInvoiceAddrressSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
