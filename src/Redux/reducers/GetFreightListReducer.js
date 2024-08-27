import {GETFREIGHTLIST_SUCCESS, GETFREIGHTLIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETFREIGHTLIST_SUCCESS:
        return { GetFreightListSuccess: true, data: action.payload };
  
      case GETFREIGHTLIST_FAILED:
        return { GetFreightListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };