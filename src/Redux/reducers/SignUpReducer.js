import { SIGNUP_FAILED, SIGNUP_SUCCESS } from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNUP_SUCCESS:
      return { SignUpSuccess: true, data: action.payload };

    case SIGNUP_FAILED:
      return { SignUpSuccess: false, error: action.payload };

    default:
      return state;
  }
};
