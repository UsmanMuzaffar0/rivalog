import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_FREIGHT_TYPES_SUCCESS,
  GET_FREIGHT_TYPES_FAILED,
  GET_FREIGHT_TYPES_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightTypeListAsync({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetFreightTypeList,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({ type: GET_FREIGHT_TYPES_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GET_FREIGHT_TYPES_FAILED, payload: e });
  }
}

export function* GetFreightTypeListSaga() {
  yield takeEvery(GET_FREIGHT_TYPES_REQUEST, GetFreightTypeListAsync);
}
export default GetFreightTypeListSaga;
