import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_TRANSPORT_TYPES_SUCCESS,
  GET_TRANSPORT_TYPES_FAILED,
  GET_TRANSPORT_TYPES_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetTransportTypeListAsync({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetTransportTypeList,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({ type: GET_TRANSPORT_TYPES_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GET_TRANSPORT_TYPES_FAILED, payload: e });
  }
}

export function* GetTransportTypeListSaga() {
  yield takeEvery(GET_TRANSPORT_TYPES_REQUEST, GetTransportTypeListAsync);
}
export default GetTransportTypeListSaga;