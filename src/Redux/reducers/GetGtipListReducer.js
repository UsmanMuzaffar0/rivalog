import { GET_GTIP_LIST_SUCCESS, GET_GTIP_LIST_FAILED } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_GTIP_LIST_SUCCESS:
      return { GetGtipListSuccess: true, data: action.payload };

    case GET_GTIP_LIST_FAILED:
      return { GetGtipListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
