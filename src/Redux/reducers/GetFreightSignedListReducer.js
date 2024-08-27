import {
  GETFREIGHTSIGNEDLIST_SUCCESS,
  GETFREIGHTSIGNEDLIST_FAILED,
  GETFREIGHTSIGNEDLIST_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetFreightSignedListSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETFREIGHTSIGNEDLIST_SUCCESS:
      return {
        GetFreightSignedListSuccess: true,
        data: action.payload,
        loader: false,
      };
    case GETFREIGHTSIGNEDLIST_LOADER:
      return {
        GetFreightSignedListSuccess: false,
        data: [],
        loader: true,
      };
    case GETFREIGHTSIGNEDLIST_FAILED:
      return {
        GetFreightSignedListSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
