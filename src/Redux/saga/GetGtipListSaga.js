import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_GTIP_LIST_SUCCESS,
  GET_GTIP_LIST_REQUEST,
  GET_GTIP_LIST_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetGtipListAsync({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetGtipList,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({
      type: GET_GTIP_LIST_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_GTIP_LIST_FAILED, payload: e });
  }
}

export function* GetGtipListSaga() {
  yield takeEvery(GET_GTIP_LIST_REQUEST, GetGtipListAsync);
}
export default GetGtipListSaga;
