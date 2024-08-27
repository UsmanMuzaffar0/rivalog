import {
  CREATETRANSPORTERGPSPOINT_SUCCESS,
  CREATETRANSPORTERGPSPOINT_FAILED,
} from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATETRANSPORTERGPSPOINT_SUCCESS:
      return { CreateTransporterGPSPointSuccess: true, data: action.payload };

    case CREATETRANSPORTERGPSPOINT_FAILED:
      return { CreateTransporterGPSPointSuccess: false, error: action.payload };

    default:
      return state;
  }
};
