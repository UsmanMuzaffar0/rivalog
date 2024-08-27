import {
  GET_CONTAINER_PROPOSAL_SUCCESS,
  GET_CONTAINER_PROPOSAL_FAILED,
  GET_CONTAINER_PROPOSAL_LOADER,
} from "../actions/types";

const INITIAL_STATE = {
  data: [],
  GetContainerProposalListSuccess: false,
  loader: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CONTAINER_PROPOSAL_SUCCESS:
      return {
        GetContainerProposalSuccess: true,
        data: action.payload,
        loader: false,
      };

    case GET_CONTAINER_PROPOSAL_LOADER:
      return {
        GetContainerProposalListSuccess: false,
        data: [],
        loader: true,
      };

    case GET_CONTAINER_PROPOSAL_FAILED:
      return {
        GetContainerProposalListSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
