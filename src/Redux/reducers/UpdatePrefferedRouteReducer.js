import { UPDATEPREFFEREDROUTE_FAILED, UPDATEPREFFEREDROUTE_SUCCESS } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATEPREFFEREDROUTE_SUCCESS:
      return { UpdatePreferredRouteSuccess: true, data: action.payload };

    case UPDATEPREFFEREDROUTE_FAILED:
      return { UpdatePreferredRouteSuccess: false, error: action.payload };

    default:
      return state;
  }
};
