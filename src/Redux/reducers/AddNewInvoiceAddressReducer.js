import {
  ADD_NEW_INVOICE_ADDRESS_FAILED,
  ADD_NEW_INVOICE_ADDRESS_LOADER,
  ADD_NEW_INVOICE_ADDRESS_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  AddNewInvoiceAddrressSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_INVOICE_ADDRESS_LOADER:
      return {
        AddNewInvoiceAddrressSuccess: false,
        data: [],
        loader: false,
      };
    case ADD_NEW_INVOICE_ADDRESS_SUCCESS:
      return {
        AddNewInvoiceAddrressSuccess: true,
        data: action.payload,
        loader: false,
      };

    case ADD_NEW_INVOICE_ADDRESS_FAILED:
      return {
        AddNewInvoiceAddrressSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
