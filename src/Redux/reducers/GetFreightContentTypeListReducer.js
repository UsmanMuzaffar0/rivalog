import {
  GET_FREIGHT_CONTENT_TYPE_LIST_SUCCESS,
  GET_FREIGHT_CONTENT_TYPE_LIST_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FREIGHT_CONTENT_TYPE_LIST_SUCCESS:
      return { GetFreightContentTypeListSuccess: true, data: action.payload };

    case GET_FREIGHT_CONTENT_TYPE_LIST_FAILED:
      return { GetFreightContentTypeListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
