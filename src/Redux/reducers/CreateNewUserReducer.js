import {
  CREATEUSERLIST_SUCCESS,
  CREATEUSERLIST_FAILED,
  CREATEUSERLIST_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  CreateNewUserSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATEUSERLIST_LOADER:
      return {
        CreateNewUserSuccess: false,
        data: [],
        loader: true,
      };
    case CREATEUSERLIST_SUCCESS:
      return {
        CreateNewUserSuccess: true,
        data: action.payload,
        loader: false,
      };

    case CREATEUSERLIST_FAILED:
      return {
        CreateNewUserSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
