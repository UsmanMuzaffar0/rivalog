import {
  UPDATE_INVOICE_ADDRESS_FAILED,
  UPDATE_INVOICE_ADDRESS_SUCCESS,
  UPDATE_INVOICE_ADDRESS_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  UpdateInvoiceAddrressSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_INVOICE_ADDRESS_LOADER:
      return {
        UpdateInvoiceAddrressSuccess: false,
        data: [],
        loader: false,
      };
    case UPDATE_INVOICE_ADDRESS_SUCCESS:
      return {
        UpdateInvoiceAddrressSuccess: true,
        data: action.payload,
        loader: false,
      };

    case UPDATE_INVOICE_ADDRESS_FAILED:
      return {
        UpdateInvoiceAddrressSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
