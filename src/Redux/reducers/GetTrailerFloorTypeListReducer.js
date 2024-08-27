import {GETTRAILERFLOORTYPELIST_SUCCESS, GETTRAILERFLOORTYPELIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERFLOORTYPELIST_SUCCESS:
        return { GetTrailerFloorTypeListSuccess: true, data: action.payload };
  
      case GETTRAILERFLOORTYPELIST_FAILED:
        return { GetTrailerFloorTypeListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };