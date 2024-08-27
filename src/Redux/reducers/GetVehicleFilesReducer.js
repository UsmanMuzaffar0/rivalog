import {GETVEHICLEFILES_SUCCESS, GETVEHICLEFILES_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETVEHICLEFILES_SUCCESS:
        return { GetVehicleFilesSuccess: true, data: action.payload };
  
      case GETVEHICLEFILES_FAILED:
        return { GetVehicleFilesSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };