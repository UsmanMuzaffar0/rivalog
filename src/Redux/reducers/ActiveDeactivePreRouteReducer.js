import { ACTIVATEDEACTIVEPREFFEREDROUTE_SUCCESS, ACTIVATEDEACTIVEPREFFEREDROUTE_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIVATEDEACTIVEPREFFEREDROUTE_SUCCESS:
      return { activedeactiveprerouteSuccess: true, data: action.payload };

    case ACTIVATEDEACTIVEPREFFEREDROUTE_FAILED:
      return { activedeactiveprerouteSuccess: false, error: action.payload };

    default:
      return state;
  }
};
