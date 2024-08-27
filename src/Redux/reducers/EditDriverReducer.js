import {EDITDRIVER_SUCCESS, EDITDRIVER_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case EDITDRIVER_SUCCESS:
      return {EditDriverSuccess: true, data: action.payload};
      
    case EDITDRIVER_FAILED:
      return {EditDriverSuccess: false, error: action.payload};

    default:
      return state;
  }
};