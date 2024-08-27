import {GETVEHICLELIST_SUCCESS, GETVEHICLELIST_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETVEHICLELIST_SUCCESS:
        return { GetVehicleListSuccess: true, data: action.payload };
  
      case GETVEHICLELIST_FAILED:
        return { GetVehicleListSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };