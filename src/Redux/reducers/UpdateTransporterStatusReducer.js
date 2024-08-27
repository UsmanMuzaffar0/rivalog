import {
  UPDATETRANSPORTERSTATUS_FAILED,
  UPDATETRANSPORTERSTATUS_SUCCESS,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATETRANSPORTERSTATUS_SUCCESS:
      return { UpdateTransporterStatusSuccess: true, data: action.payload };

    case UPDATETRANSPORTERSTATUS_FAILED:
      return { UpdateTransporterStatusSuccess: false, error: action.payload };

    default:
      return state;
  }
};
