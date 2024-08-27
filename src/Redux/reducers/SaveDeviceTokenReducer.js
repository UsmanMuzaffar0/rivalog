import {
  SAVEDEVICETOKEN_FAILED,
  SAVEDEVICETOKEN_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVEDEVICETOKEN_SUCCESS:
      return { SaveDeviceTokenSuccess: true, data: action.payload };

    case SAVEDEVICETOKEN_FAILED:
      return { SaveDeviceTokenSuccess: false, error: action.payload };

    default:
      return state;
  }
};
