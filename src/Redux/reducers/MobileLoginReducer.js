import {MOBILELOGIN_FAILED,MOBILELOGIN_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MOBILELOGIN_SUCCESS:
      return {LoginSuccess: true, data: action.payload};

    case MOBILELOGIN_FAILED:
      return {LoginSuccess: false, error: action.payload};

    default:
      return state;
  }
};
