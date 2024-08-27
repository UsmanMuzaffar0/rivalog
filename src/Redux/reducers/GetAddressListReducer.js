import {GETADDRESS_SUCCESS, GETADDRESS_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case GETADDRESS_SUCCESS:
      return {getAddressSuccess: true, data: action.payload};
      
    case GETADDRESS_FAILED:
      return {getAddressSuccess: false, error: action.payload};

    default:
      return state;
  }
};