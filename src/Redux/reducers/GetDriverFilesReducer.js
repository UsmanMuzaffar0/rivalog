import {GETDRIVERFILES_SUCCESS, GETDRIVERFILES_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETDRIVERFILES_SUCCESS:
        return { GetDriverFilesSuccess: true, data: action.payload };
  
      case GETDRIVERFILES_FAILED:
        return { GetDriverFilesSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };