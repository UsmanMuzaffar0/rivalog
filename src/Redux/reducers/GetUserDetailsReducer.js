import {GETUSERDETAIS_SUCCESS, GETUSERDETAIS_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETUSERDETAIS_SUCCESS:
        return { GetUserDetailsSuccess: true, data: action.payload };
  
      case GETUSERDETAIS_FAILED:
        return { GetUserDetailsSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };