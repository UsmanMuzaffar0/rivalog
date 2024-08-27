import {
  CREATE_FREIGHT_SUCCESS,
  CREATE_FREIGHT_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_FREIGHT_SUCCESS:
      return {
        CreateFreightSuccess: true,
        data: action.payload,
        loader: false,
      };

    case CREATE_FREIGHT_FAILED:
      return {
        CreateFreightSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
