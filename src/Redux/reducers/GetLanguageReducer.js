import {GETLANG_FAILED, GETLANG_SUCCESS} from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETLANG_SUCCESS:
      return {GetLangSuccess: true, data: action.payload};

    case GETLANG_FAILED:
      return {GetLangSuccess: false, error: action.payload};

    default:
      return state;
  }
};
