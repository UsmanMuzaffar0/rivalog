import {
  GET_SELCTED_CONTAINER_PROPOSAL_FAILED,
  GET_SELCTED_CONTAINER_PROPOSAL_SUCCESS,
  GET_SELCTED_CONTAINER_PROPOSAL_LOADER,
} from "../actions/types";

const INITIAL_STATE = {
  data: [],
  GetSelectedContainerProposalSuccess: false,
  loader: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SELCTED_CONTAINER_PROPOSAL_SUCCESS:
      return {
        data: action.payload,
        GetSelectedContainerProposalSuccess: true,
        loader: false,
      };

    case GET_SELCTED_CONTAINER_PROPOSAL_LOADER:
      return {
        GetSelectedContainerProposalSuccess: false,
        data: [],
        loader: true,
      };

    case GET_SELCTED_CONTAINER_PROPOSAL_FAILED:
      return {
        GetSelectedContainerProposalSuccess: false,
        error: action.payload,
        loader: false,
      };

    default:
      return state;
  }
};
