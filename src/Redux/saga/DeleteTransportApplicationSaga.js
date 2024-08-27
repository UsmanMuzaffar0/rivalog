import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  DELETETRANSPORTAPPLICATION_REQUEST,
  DELETETRANSPORTAPPLICATION_SUCCESS,
  DELETETRANSPORTAPPLICATION_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* DeleteTransportApplicationAsyn({ params }) {
  try {
    const response = yield call(Api.DeleteTransportApplication, params);

    yield put({ type: DELETETRANSPORTAPPLICATION_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: DELETETRANSPORTAPPLICATION_FAILED, payload: e });
  }
}

export function* DeleteTransportApplicationSaga() {
  yield takeEvery(DELETETRANSPORTAPPLICATION_REQUEST, DeleteTransportApplicationAsyn);
}
export default DeleteTransportApplicationSaga;
