import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_PACKAGING_TYPE_SUCCESS,
  GET_PACKAGING_TYPE_REQUEST,
  GET_PACKAGING_TYPE_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetPackagingTypeAsync({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetPackagingType,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({
      type: GET_PACKAGING_TYPE_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_PACKAGING_TYPE_FAILED, payload: e });
  }
}

export function* GetPackagingTypeSaga() {
  yield takeEvery(GET_PACKAGING_TYPE_REQUEST, GetPackagingTypeAsync);
}
export default GetPackagingTypeSaga;
