import {CREATETRANSPORTAPPLICATION_FAILED, CREATETRANSPORTAPPLICATION_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case CREATETRANSPORTAPPLICATION_SUCCESS:
      return {CreateTransportApplicationSuccess: true, data: action.payload};
      
    case CREATETRANSPORTAPPLICATION_FAILED:
      return {CreateTransportApplicationSuccess: false, error: action.payload};

    default:
      return state;
  }
};