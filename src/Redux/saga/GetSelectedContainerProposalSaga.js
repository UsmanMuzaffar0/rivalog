import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_SELCTED_CONTAINER_PROPOSAL_SUCCESS,
  GET_SELCTED_CONTAINER_PROPOSAL_FAILED,
  GET_SELCTED_CONTAINER_PROPOSAL_REQUEST,
  GET_SELCTED_CONTAINER_PROPOSAL_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetSelectedContainerProposalAsyn({ containerId }) {
  try {
    yield put({ type: GET_SELCTED_CONTAINER_PROPOSAL_LOADER, payload: null });
    const response = yield call(Api.GetSelectedContainerProposal, containerId);
    yield put({
      type: GET_SELCTED_CONTAINER_PROPOSAL_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_SELCTED_CONTAINER_PROPOSAL_FAILED, payload: e });
  }
}

export function* GetSelectedContainerProposalSaga() {
  yield takeEvery(
    GET_SELCTED_CONTAINER_PROPOSAL_REQUEST,
    GetSelectedContainerProposalAsyn
  );
}
export default GetSelectedContainerProposalSaga;
