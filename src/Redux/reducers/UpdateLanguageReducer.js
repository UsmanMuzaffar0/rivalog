import {
    UPDATELANG_FAILED,
    UPDATELANG_SUCCESS,
  } from "../actions/types";
  const INITIAL_STATE = {};
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case UPDATELANG_SUCCESS:
        return { UpdateLanguageStatusSuccess: true, data: action.payload };
  
      case UPDATELANG_FAILED:
        return { UpdateLanguageStatusSuccess: false, error: action.payload };
  
      default:
        return state;
    }
  };
  