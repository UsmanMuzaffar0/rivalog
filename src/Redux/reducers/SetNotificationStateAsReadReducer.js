import {
  SETNOTIFICATIONSTATEASREAD_FAILED,
  SETNOTIFICATIONSTATEASREAD_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETNOTIFICATIONSTATEASREAD_SUCCESS:
      return { SetNotificationStateAsReadSuccess: true, data: action.payload };

    case SETNOTIFICATIONSTATEASREAD_FAILED:
      return { SetNotificationStateAsReadSuccess: false, error: action.payload };

    default:
      return state;
  }
};
