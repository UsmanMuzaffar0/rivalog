import {GETTRAILERPLATEPICTURE_SUCCESS, GETTRAILERPLATEPICTURE_FAILED} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GETTRAILERPLATEPICTURE_SUCCESS:
        return { GetTrailerPlatePictureSuccess: true, data: action.payload };
  
      case GETTRAILERPLATEPICTURE_FAILED:
        return { GetTrailerPlatePictureSuccess: false, error: action.payload };
  
      default:
        return state; 
    }
  };