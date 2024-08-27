import {GETDRIVERLIST_SUCCESS, GETDRIVERLIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETDRIVERLIST_SUCCESS:
        return { GetDriverListSuccess: true, data: action.payload };
  
      case GETDRIVERLIST_FAILED:
        return { GetDriverListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };