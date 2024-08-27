import { GETCOMPANY_FAILED, GETCOMPANY_SUCCESS } from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETCOMPANY_SUCCESS:
      return { GetCompanySuccess: true, data: action.payload };

    case GETCOMPANY_FAILED:
      return { GetCompanySuccess: false, error: action.payload };

    default:
      return state;
  }
};
