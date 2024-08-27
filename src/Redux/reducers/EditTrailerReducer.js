import {EDITTRAILER_SUCCESS, EDITTRAILER_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case EDITTRAILER_SUCCESS:
      return {EditTrailerSuccess: true, data: action.payload};
      
    case EDITTRAILER_FAILED:
      return {EditTrailerSuccess: false, error: action.payload};

    default:
      return state;
  }
};