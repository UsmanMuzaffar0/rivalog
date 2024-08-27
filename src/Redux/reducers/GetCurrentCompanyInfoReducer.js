import {
  GETCURRENTCOMPANYINFO_FAILED,
  GETCURRENTCOMPANYINFO_SUCCESS,
  GETCURRENTCOMPANYINFO_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetCurrentCompaanyInfoSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GETCURRENTCOMPANYINFO_SUCCESS:
      return {
        GetCurrentCompaanyInfoSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GETCURRENTCOMPANYINFO_LOADER:
      return {
        GetCurrentCompaanyInfoSuccess: false,
        data: [],
        loader: true,
      };

    case GETCURRENTCOMPANYINFO_FAILED:
      return {
        GetCurrentCompaanyInfoSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
