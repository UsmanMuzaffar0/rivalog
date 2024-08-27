import { CREATETRANSPORTER_SUCCESS, CREATETRANSPORTER_FAILED } from "../actions/types";
const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATETRANSPORTER_SUCCESS:
      return { createTransporterSuccess: true, data: action.payload };

    case CREATETRANSPORTER_FAILED:
      return { createTransporterSuccess: false, error: action.payload };

    default:
      return state;
  }
};
