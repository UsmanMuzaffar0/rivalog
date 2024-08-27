import {
  GETMYFREIGHT_SUCCESS,
  GETMYFREIGHT_FAILED,
  GETMYFREIGHT_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetMyFreightSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETMYFREIGHT_SUCCESS:
      return {
        GetMyFreightSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GETMYFREIGHT_LOADER:
      return {
        GetMyFreightSuccess: false,
        data: [],
        loader: true,
      };

    case GETMYFREIGHT_FAILED:
      return {
        GetMyFreightSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
