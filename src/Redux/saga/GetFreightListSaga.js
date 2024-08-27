import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETFREIGHTLIST_SUCCESS,
  GETFREIGHTLIST_FAILED,
  GETFREIGHTLIST_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightListAsyn({
  SearchText,
  PageIndex,
  PageCount,
  FilterOptions,
}) {
  try {
    const response = yield call(
      Api.GetFreightList,
      SearchText,
      PageIndex,
      PageCount,
      FilterOptions
    );
    yield put({ type: GETFREIGHTLIST_SUCCESS, payload: response });
  } catch (e) {
    console.error(e);
    yield put({ type: GETFREIGHTLIST_FAILED, payload: e });
  }
}

export function* GetFreightListSaga() {
  yield takeEvery(GETFREIGHTLIST_REQUEST, GetFreightListAsyn);
}
export default GetFreightListSaga;
