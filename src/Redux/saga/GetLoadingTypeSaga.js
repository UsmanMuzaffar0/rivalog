import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_LOADING_TYPE_SUCCESS,
  GET_LOADING_TYPE_REQUEST,
  GET_LOADING_TYPE_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetLoadingTypeAsync({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetLoadingType,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({
      type: GET_LOADING_TYPE_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_LOADING_TYPE_FAILED, payload: e });
  }
}

export function* GetLoadingTypeSaga() {
  yield takeEvery(GET_LOADING_TYPE_REQUEST, GetLoadingTypeAsync);
}
export default GetLoadingTypeSaga;
