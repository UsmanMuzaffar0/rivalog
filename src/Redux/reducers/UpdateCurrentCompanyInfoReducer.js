import {
  UPDATECURRENTCOMPANYINFO_FAILED,
  UPDATECURRENTCOMPANYINFO_SUCCESS,
  UPDATECURRENTCOMPANYINFO_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  UpdateCurrentCompanyInfoSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATECURRENTCOMPANYINFO_SUCCESS:
      return {
        UpdateCurrentCompanyInfoSuccess: true,
        data: action.payload,
        loader: false,
      };

    case UPDATECURRENTCOMPANYINFO_LOADER:
      return {
        UpdateCurrentCompanyInfoSuccess: false,
        data: [],
        loader: true,
      };

    case UPDATECURRENTCOMPANYINFO_FAILED:
      return {
        UpdateCurrentCompanyInfoSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
