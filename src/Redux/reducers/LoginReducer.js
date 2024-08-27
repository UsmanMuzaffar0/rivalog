import {EMAILLOGIN_FAILED, EMAILLOGIN_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case EMAILLOGIN_SUCCESS:
      return {LoginSuccess: true, data: action.payload};

    case EMAILLOGIN_FAILED:
      return {LoginSuccess: false, error: action.payload};

    default:
      return state;
  }
};
