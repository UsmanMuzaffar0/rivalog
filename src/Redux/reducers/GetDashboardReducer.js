import {DASHBOARD_SUCCESS, DASHBOARD_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case DASHBOARD_SUCCESS:
        return { GetDashboardSuccess: true, data: action.payload };
  
      case DASHBOARD_FAILED:
        return { GetDashboardSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };