import {DELETEVEHICLE_SUCCESS, DELETEVEHICLE_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case DELETEVEHICLE_SUCCESS:
        return { DeleteVehicleSuccess: true, data: action.payload };
  
      case DELETEVEHICLE_FAILED:
        return { DeleteVehicleSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };