import {
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCY_LIST_SUCCESS:
      return { GetCurrencyListSuccess: true, data: action.payload };

    case GET_CURRENCY_LIST_FAILED:
      return { GetCurrencyListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
