import {
  GETUSERLIST_FAILED,
  GETUSERLIST_LOADER,
  GETUSERLIST_REQUEST,
  GETUSERLIST_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GeUsersListSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETUSERLIST_SUCCESS:
      return {
        GeUsersListSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GETUSERLIST_REQUEST:
      return {
        GeUsersListSuccess: false,
        data: [],
        loader: true,
      };

    case GETUSERLIST_FAILED:
      return {
        GeUsersListSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
