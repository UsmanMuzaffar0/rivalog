import {GETTRAILERDETAILS_SUCCESS, GETTRAILERDETAILS_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERDETAILS_SUCCESS:
        return { GetTrailerDetailsSuccess: true, data: action.payload };
  
      case GETTRAILERDETAILS_FAILED:
        return { GetTrailerDetailsSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };