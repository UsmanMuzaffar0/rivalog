import {GETTRAILERTYPELIST_SUCCESS, GETTRAILERTYPELIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERTYPELIST_SUCCESS:
        return { GetTrailerTypeListSuccess: true, data: action.payload };
  
      case GETTRAILERTYPELIST_FAILED:
        return { GetTrailerTypeListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };