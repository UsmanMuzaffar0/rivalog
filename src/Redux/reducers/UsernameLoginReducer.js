import {USERNAMELOGIN_FAILED,USERNAMELOGIN_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case USERNAMELOGIN_SUCCESS:
      return {LoginSuccess: true, data: action.payload};

    case USERNAMELOGIN_FAILED:
      return {LoginSuccess: false, error: action.payload};

    default:
      return state;
  }
};
