import { SETASPRIMARY_FAILED, SETASPRIMARY_SUCCESS } from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETASPRIMARY_SUCCESS:
      return { SetAsPrimarySuccess: true, data: action.payload };

    case SETASPRIMARY_FAILED:
      return { SetAsPrimarySuccess: false, error: action.payload };

    default:
      return state;
  }
};
