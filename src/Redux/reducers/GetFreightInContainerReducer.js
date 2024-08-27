import {
  GET_FREIGHT_IN_CONTAINER_SUCCESS,
  GET_FREIGHT_IN_CONTAINER_FAILED,
  GET_FREIGHT_IN_CONTAINER_LOADER,
} from "../actions/types";

const INITIAL_STATE = {
  data: [],
  GetFreightInContainerSuccess: false,
  loader: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_FREIGHT_IN_CONTAINER_SUCCESS:
      return {
        GetContainerProposalSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GET_FREIGHT_IN_CONTAINER_LOADER:
      return {
        GetFreightInContainerSuccess: false,
        data: [],
        loader: true,
      };

    case GET_FREIGHT_IN_CONTAINER_FAILED:
      return {
        GetFreightInContainerSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
