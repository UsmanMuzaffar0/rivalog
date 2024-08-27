import { NOTIFICATIONTOKEN_SUCCESS, NOTIFICATIONTOKEN_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFICATIONTOKEN_SUCCESS:
      return { addnotificationtokenSuccess: true, data: action.payload };

    case NOTIFICATIONTOKEN_FAILED:
      return { addnotificationtokenSuccess: false, error: action.payload };

    default:
      return state;
  }
};
