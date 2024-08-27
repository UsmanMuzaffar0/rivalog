import {
  GET_LOADING_TYPE_FAILED,
  GET_LOADING_TYPE_SUCCESS,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOADING_TYPE_SUCCESS:
      return { GetLoadingTypeSuccess: true, data: action.payload };

    case GET_LOADING_TYPE_FAILED:
      return { GetLoadingTypeSuccess: false, error: action.payload };

    default:
      return state;
  }
};
