import { DELETEBANKACCOUNT_SUCCESS, DELETEBANKACCOUNT_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETEBANKACCOUNT_SUCCESS:
      return { DeleteBankAccountSuccess: true, data: action.payload };

    case DELETEBANKACCOUNT_FAILED:
      return { DeleteBankAccountSuccess: false, error: action.payload };

    default:
      return state;
  }
};
