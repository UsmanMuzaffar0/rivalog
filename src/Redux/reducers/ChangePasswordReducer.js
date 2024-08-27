import { CHANGEPASSWORD_FAILED, CHANGEPASSWORD_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGEPASSWORD_SUCCESS:
      return { ChangePasswordSuccess: true, data: action.payload };

    case CHANGEPASSWORD_FAILED:
      return { ChangePasswordSuccess: false, error: action.payload };

    default:
      return state;
  }
};
