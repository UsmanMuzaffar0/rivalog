import {DELETETRANSPORTAPPLICATION_FAILED, DELETETRANSPORTAPPLICATION_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case DELETETRANSPORTAPPLICATION_SUCCESS:
      return {DeleteTransportApplicationSuccess: true, data: action.payload};
      
    case DELETETRANSPORTAPPLICATION_FAILED:
      return {DeleteTransportApplicationSuccess: false, error: action.payload};

    default:
      return state;
  }
};