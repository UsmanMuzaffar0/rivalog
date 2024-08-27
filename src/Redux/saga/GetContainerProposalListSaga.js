import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_CONTAINER_PROPOSAL_LIST_SUCCESS,
  GET_CONTAINER_PROPOSAL_LIST_FAILED,
  GET_CONTAINER_PROPOSAL_LIST_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetContainerProposalListAsyn({
  SearchText,
  PageIndex,
  PageCount,
}) {
  try {
    const response = yield call(
      Api.GetContainerProposalList,
      SearchText,
      PageIndex,
      PageCount
    );

    yield put({ type: GET_CONTAINER_PROPOSAL_LIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GET_CONTAINER_PROPOSAL_LIST_FAILED, payload: e });
  }
}

export function* GetContainerProposalListSaga() {
  yield takeEvery(
    GET_CONTAINER_PROPOSAL_LIST_REQUEST,
    GetContainerProposalListAsyn
  );
}
export default GetContainerProposalListSaga;
