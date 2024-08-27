import {
  GET_CONTAINER_PROPOSAL_LIST_SUCCESS,
  GET_CONTAINER_PROPOSAL_LIST_FAILED,
} from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CONTAINER_PROPOSAL_LIST_SUCCESS:
      return { GetContainerProposalListSuccess: true, data: action.payload };

    case GET_CONTAINER_PROPOSAL_LIST_FAILED:
      return { GetContainerProposalListSuccess: false, error: action.payload };

    default:
      return state;
  }
};
