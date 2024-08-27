import { GETREFRESHTOKEN_FAILED,GETREFRESHTOKEN_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETREFRESHTOKEN_SUCCESS:
      return { Getrefreshtokensuccess: true, data: action.payload };

    case GETREFRESHTOKEN_FAILED:
      return { Getrefreshtokensuccess: false, error: action.payload };

    default:
      return state;
  }
};
