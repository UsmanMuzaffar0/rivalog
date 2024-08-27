import {ADDVEHICLE_SUCCESS, ADDVEHICLE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case ADDVEHICLE_SUCCESS:
      return {AddVehicleSuccess: true, data: action.payload};
      
    case ADDVEHICLE_FAILED:
      return {AddVehicleSuccess: false, error: action.payload};

    default:
      return state;
  }
};