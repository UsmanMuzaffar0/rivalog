import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_CONTAINER_PROPOSAL_SUCCESS,
  GET_CONTAINER_PROPOSAL_FAILED,
  GET_CONTAINER_PROPOSAL_REQUEST,
  GET_CONTAINER_PROPOSAL_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetContainerProposalAsyn({
  containerId,
  PageIndex,
  PageCount,
}) {
  try {
    yield put({ type: GET_CONTAINER_PROPOSAL_LOADER, payload: null });
    const response = yield call(
      Api.GetContainerProposal,
      containerId,
      PageIndex,
      PageCount
    );

    yield put({ type: GET_CONTAINER_PROPOSAL_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GET_CONTAINER_PROPOSAL_FAILED, payload: e });
  }
}

export function* GetContainerProposalSaga() {
  yield takeEvery(GET_CONTAINER_PROPOSAL_REQUEST, GetContainerProposalAsyn);
}
export default GetContainerProposalSaga;
