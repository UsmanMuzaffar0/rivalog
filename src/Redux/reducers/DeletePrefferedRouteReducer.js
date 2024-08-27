import { DELETEPREFFEREDROUTE_FAILED, DELETEPREFFEREDROUTE_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETEPREFFEREDROUTE_SUCCESS:
      return { DeletePreferredRouteSuccess: true, data: action.payload };

    case DELETEPREFFEREDROUTE_FAILED:
      return { DeletePreferredRouteSuccess: false, error: action.payload };

    default:
      return state;
  }
};
