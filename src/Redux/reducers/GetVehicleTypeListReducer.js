import {GETVEHICLETYPELIST_SUCCESS, GETVEHICLETYPELIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETVEHICLETYPELIST_SUCCESS:
        return { GetVehicleTypeListSuccess: true, data: action.payload };
  
      case GETVEHICLETYPELIST_FAILED:
        return { GetVehicleTypeListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };