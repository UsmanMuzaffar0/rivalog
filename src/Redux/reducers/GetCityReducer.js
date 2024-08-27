import { GETCITY_FAILED, GETCITY_SUCCESS } from '../actions/types';
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETCITY_SUCCESS:
      return { GetCitySuccess: true, data: action.payload };

    case GETCITY_FAILED:
      return { GetCitySuccess: false, error: action.payload };

    default:
      return state;
  }
};
