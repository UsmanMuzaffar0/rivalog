import {UPLOADDRIVERFILE_SUCCESS, UPLOADDRIVERFILE_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case UPLOADDRIVERFILE_SUCCESS:
      return {UploadDriverFileSuccess: true, data: action.payload};
      
    case UPLOADDRIVERFILE_FAILED:
      return {UploadDriverFileSuccess: false, error: action.payload};

    default:
      return state;
  }
};