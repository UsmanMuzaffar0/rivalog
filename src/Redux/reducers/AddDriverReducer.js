import { ADDDRIVER_SUCCESS, ADDDRIVER_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADDDRIVER_SUCCESS:
      return { AddDriverSuccess: true, data: action.payload };

    case ADDDRIVER_FAILED:
      return { AddDriverSuccess: false, error: action.payload };

    default:
      return state;
  }
};
