import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  ADDDRIVER_REQUEST,
  ADDDRIVER_SUCCESS,
  ADDDRIVER_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* AddDriverAsyn({ params }) {
  try {
    const response = yield call(Api.AddDriver, params);

    yield put({ type: ADDDRIVER_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: ADDDRIVER_FAILED, payload: e });
  }
}

export function* AddDriverSaga() {
  yield takeEvery(ADDDRIVER_REQUEST, AddDriverAsyn);
}
export default AddDriverSaga;
