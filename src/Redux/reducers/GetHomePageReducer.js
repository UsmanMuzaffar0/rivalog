import {
  HOME_PAGE_SUCCESS,
  HOME_PAGE_FAILED,
  HOME_PAGE_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GeHomePageSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HOME_PAGE_SUCCESS:
      return {
        GeHomePageSuccess: true,
        data: action.payload,
        loader: false,
      };

    case HOME_PAGE_LOADER:
      return {
        GeHomePageSuccess: false,
        data: [],
        loader: true,
      };

    case HOME_PAGE_FAILED:
      return {
        GeHomePageSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
