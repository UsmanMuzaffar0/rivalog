import {
  GET_PACKAGING_TYPE_SUCCESS,
  GET_PACKAGING_TYPE_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PACKAGING_TYPE_SUCCESS:
      return { GetPackagingTypeSuccess: true, data: action.payload };

    case GET_PACKAGING_TYPE_FAILED:
      return { GetPackagingTypeSuccess: false, error: action.payload };

    default:
      return state;
  }
};
