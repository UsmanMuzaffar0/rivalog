import { GETPREFFEREDROUTE_FAILED, GETPREFFEREDROUTE_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETPREFFEREDROUTE_SUCCESS:
      return { GetPreferredRouteSuccess: true, data: action.payload };

    case GETPREFFEREDROUTE_FAILED:
      return { GetPreferredRouteSuccess: false, error: action.payload };

    default:
      return state;
  }
};
