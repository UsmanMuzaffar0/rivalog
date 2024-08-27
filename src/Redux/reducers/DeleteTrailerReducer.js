
import {DELETETRAILER_SUCCESS, DELETETRAILER_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case DELETETRAILER_SUCCESS:
        return { DeleteTrailerSuccess: true, data: action.payload };
  
      case DELETETRAILER_FAILED:
        return { DeleteTrailerSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };