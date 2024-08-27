import {
  GETNOTIFICATIONLIST_FAILED,
  GETNOTIFICATIONLIST_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETNOTIFICATIONLIST_SUCCESS:
      return { GetNotificationSuccess: true, data: action.payload };

    case GETNOTIFICATIONLIST_FAILED:
      return { GetNotificationSuccess: false, error: action.payload };

    default:
      return state;
  }
};
