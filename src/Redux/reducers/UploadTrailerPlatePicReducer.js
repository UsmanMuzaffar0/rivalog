import {UPLOADTRAILERPLATEPIC_SUCCESS, UPLOADTRAILERPLATEPIC_FAILED} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case UPLOADTRAILERPLATEPIC_SUCCESS:
      return {UploadTrailerPlatePicSuccess: true, data: action.payload};
      
    case UPLOADTRAILERPLATEPIC_FAILED:
      return {UploadTrailerPlatePicSuccess: false, error: action.payload};

    default:
      return state;
  }
};