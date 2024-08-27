import {GETTRAILERLIST_SUCCESS, GETTRAILERLIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERLIST_SUCCESS:
        return { GetTrailerListSuccess: true, data: action.payload };
  
      case GETTRAILERLIST_FAILED:
        return { GetTrailerListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };