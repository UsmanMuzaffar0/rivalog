import {
  DELETEUSERLIST_SUCCESS,
  DELETEUSERLIST_FAILED,
  DELETEUSERLIST_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  DeleteUserSuccess: false,
  data: [],
  loader: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DELETEUSERLIST_SUCCESS:
      return { DeleteUserSuccess: true, data: action.payload, loader: false };

    case DELETEUSERLIST_LOADER:
      return { DeleteUserSuccess: true, data: [], loader: true };

    case DELETEUSERLIST_FAILED:
      return { DeleteUserSuccess: false, error: action.payload, loader: false };

    default:
      return state;
  }
};
