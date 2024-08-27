import { GETCOUNTRY_FAILED, GETCOUNTRY_SUCCESS } from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETCOUNTRY_SUCCESS:
      return { GetCountrySuccess: true, data: action.payload };

    case GETCOUNTRY_FAILED:
      return { GetCountrySuccess: false, error: action.payload };

    default:
      return state;
  }
};
