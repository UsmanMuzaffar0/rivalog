import {ADDTRAILER_SUCCESS, ADDTRAILER_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case ADDTRAILER_SUCCESS:
      return {AddTrailerSuccess: true, data: action.payload};
      
    case ADDTRAILER_FAILED:
      return {AddTrailerSuccess: false, error: action.payload};

    default:
      return state;
  }
};