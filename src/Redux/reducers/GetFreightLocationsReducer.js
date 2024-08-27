import {
  GET_FREIGHT_LOCATIONS_FAILED,
  GET_FREIGHT_LOCATIONS_SUCCESS,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FREIGHT_LOCATIONS_SUCCESS:
      return { GetFreightLocationSuccess: true, data: action.payload };

    case GET_FREIGHT_LOCATIONS_FAILED:
      return { GetFreightLocationSuccess: false, error: action.payload };

    default:
      return state;
  }
};
