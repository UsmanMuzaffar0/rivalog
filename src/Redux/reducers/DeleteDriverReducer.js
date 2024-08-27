import {DELETEDRIVER_SUCCESS, DELETEDRIVER_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case DELETEDRIVER_SUCCESS:
        return { DeleteDriverSuccess: true, data: action.payload };
  
      case DELETEDRIVER_FAILED:
        return { DeleteDriverSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };