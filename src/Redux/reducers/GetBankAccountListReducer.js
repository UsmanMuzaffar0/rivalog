import { GETBANKACCOUNTLIST_SUCCESS, GETBANKACCOUNTLIST_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETBANKACCOUNTLIST_SUCCESS:
      return { GetBankAccountListSuccess: true, data: action.payload };

    case GETBANKACCOUNTLIST_FAILED:
      return { GetBankAccountListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
