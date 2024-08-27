import {
  GETINVOICEADDRESSES_SUCCESS,
  GETINVOICEADDRESSES_FAILED,
  GETINVOICEADDRESSES_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetInvoiceAddressesSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETINVOICEADDRESSES_SUCCESS:
      return {
        GetInvoiceAddressesSuccess: true,
        data: action.payload,
        loader: false,
      };
    case GETINVOICEADDRESSES_LOADER:
      return {
        GetInvoiceAddressesSuccess: false,
        data: [],
        loader: true,
      };
    case GETINVOICEADDRESSES_FAILED:
      return {
        GetInvoiceAddressesSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
