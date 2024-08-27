import {UPLOADVEHICLEFILE_SUCCESS, UPLOADVEHICLEFILE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case UPLOADVEHICLEFILE_SUCCESS:
      return {UploadVehicleFileSuccess: true, data: action.payload};
      
    case UPLOADVEHICLEFILE_FAILED:
      return {UploadVehicleFileSuccess: false, error: action.payload};

    default:
      return state;
  }
};