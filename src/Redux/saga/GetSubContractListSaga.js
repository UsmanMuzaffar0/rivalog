import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_SUB_CONTRACT_LIST_FAILED,
  GET_SUB_CONTRACT_LIST_SUCCESS,
  GET_SUB_CONTRACT_LIST_REQUEST,
  GET_SUB_CONTRACT_LIST_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetSubContractList({
  SearchText,
  PageIndex,
  PageCount,
  freightStatusId,
  companyId,
}) {
  try {
    yield put({ type: GET_SUB_CONTRACT_LIST_LOADER, payload: null });
    const response = yield call(
      Api.GetSubContractList,
      SearchText,
      PageIndex,
      PageCount,
      freightStatusId,
      companyId
    );
    yield put({
      type: GET_SUB_CONTRACT_LIST_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_SUB_CONTRACT_LIST_FAILED, payload: e });
  }
}

export function* GetSubContractListSaga() {
  yield takeEvery(GET_SUB_CONTRACT_LIST_REQUEST, GetSubContractList);
}
export default GetSubContractListSaga;
