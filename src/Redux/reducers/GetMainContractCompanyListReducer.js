import {
  GET_MAIN_CONTRACT_COMPANY_LIST_SUCCESS,
  GET_MAIN_CONTRACT_COMPANY_LIST_FAILED,
  GET_MAIN_CONTRACT_COMPANY_LIST_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetMainContractCompanyListSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MAIN_CONTRACT_COMPANY_LIST_SUCCESS:
      return {
        GetMainContractCompanyListSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GET_MAIN_CONTRACT_COMPANY_LIST_LOADER:
      return {
        GetMainContractCompnyListSuccess: false,
        data: [],
        loader: true,
      };

    case GET_MAIN_CONTRACT_COMPANY_LIST_FAILED:
      return {
        GetMainContractCompanyListSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
