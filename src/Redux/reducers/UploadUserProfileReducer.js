import {UPLOADUSERPROFILE_SUCCESS, UPLOADUSERPROFILE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case UPLOADUSERPROFILE_SUCCESS:
      return {UploadUserProfileSuccess: true, data: action.payload};
      
    case UPLOADUSERPROFILE_FAILED:
      return {UploadUserProfileSuccess: false, error: action.payload};

    default:
      return state;
  }
};