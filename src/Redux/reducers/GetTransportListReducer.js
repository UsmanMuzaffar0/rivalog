import {
  GETTRANSPORTLIST_SUCCESS,
  GETTRANSPORTLIST_FAILED,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETTRANSPORTLIST_SUCCESS:
      return { GetTransportListSuccess: true, data: action.payload };

    case GETTRANSPORTLIST_FAILED:
      return { GetTransportListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
