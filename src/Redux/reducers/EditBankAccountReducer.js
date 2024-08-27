import { EDITBANKACCOUNT_SUCCESS, EDITBANKACCOUNT_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EDITBANKACCOUNT_SUCCESS:
      return { EditBankAccountSuccess: true, data: action.payload };

    case EDITBANKACCOUNT_FAILED:
      return { EditBankAccountSuccess: false, error: action.payload };

    default:
      return state;
  }
};
