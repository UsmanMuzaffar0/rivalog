import {
  GETFREIGHTSTATUS_FAILED,
  GETFREIGHTSTATUS_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {
  loader: true,
  data: [],
  GetFreightStatusSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETFREIGHTSTATUS_SUCCESS:
      return {
        GetFreightStatusSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GETFREIGHTSTATUS_FAILED:
      return {
        GetFreightStatusSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
