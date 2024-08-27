import {GETTRAILERSPECIFICATIONTYPELIST_SUCCESS, GETTRAILERSPECIFICATIONTYPELIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERSPECIFICATIONTYPELIST_SUCCESS:
        return { GetTrailerSpecificationListSuccess: true, data: action.payload };
  
      case GETTRAILERSPECIFICATIONTYPELIST_FAILED:
        return { GetTrailerSpecificationListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };