import {
  GET_SUB_CONTRACT_LIST_SUCCESS,
  GET_SUB_CONTRACT_LIST_FAILED,
  GET_SUB_CONTRACT_LIST_LOADER,
} from "../actions/types";
const INITIAL_STATE = {
  loader: false,
  data: [],
  GetSubContractListSuccess: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SUB_CONTRACT_LIST_SUCCESS:
      return {
        GetSubContractListSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GET_SUB_CONTRACT_LIST_LOADER:
      return {
        GetSubContractListSuccess: false,
        data: [],
        loader: true,
      };

    case GET_SUB_CONTRACT_LIST_FAILED:
      return {
        GetSubContractListSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
