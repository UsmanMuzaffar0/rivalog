import {EDITVEHICLE_SUCCESS, EDITVEHICLE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case EDITVEHICLE_SUCCESS:
      return {EditVehicleSuccess: true, data: action.payload};
      
    case EDITVEHICLE_FAILED:
      return {EditVehicleSuccess: false, error: action.payload};

    default:
      return state;
  }
};