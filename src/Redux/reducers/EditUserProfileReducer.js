import {EDITUSERPROFILE_SUCCESS, EDITUSERPROFILE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case EDITUSERPROFILE_SUCCESS:
      return {EditProfileSuccess: true, data: action.payload};
      
    case EDITUSERPROFILE_FAILED:
      return {EditProfileSuccess: false, error: action.payload};

    default:
      return state;
  }
};