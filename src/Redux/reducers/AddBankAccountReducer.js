import { ADDBANKACCOUNT_SUCCESS, ADDBANKACCOUNT_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADDBANKACCOUNT_SUCCESS:
      return { AddBankAccountSuccess: true, data: action.payload };

    case ADDBANKACCOUNT_FAILED:
      return { AddBankAccountSuccess: false, error: action.payload };

    default:
      return state;
  }
};
