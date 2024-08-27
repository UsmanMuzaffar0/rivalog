import { ADDPREFFEREDROUTE_FAILED, ADDPREFFEREDROUTE_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADDPREFFEREDROUTE_SUCCESS:
      return { AddPreferredRouteSuccess: true, data: action.payload };

    case ADDPREFFEREDROUTE_FAILED:
      return { AddPreferredRouteSuccess: false, error: action.payload };

    default:
      return state;
  }
};
