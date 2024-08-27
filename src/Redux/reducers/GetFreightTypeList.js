import {
  GET_FREIGHT_TYPES_SUCCESS,
  GET_FREIGHT_TYPES_FAILED,
} from "../actions/types";
const INITIAL_STATE = {
  loader: true,
  data: [],
  GetFreightTypes: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FREIGHT_TYPES_SUCCESS:
      return {
        GetFreightTypes: true,
        data: action.payload,
        loader: false,
      };

    case GET_FREIGHT_TYPES_FAILED:
      return {
        GetFreightTypes: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
