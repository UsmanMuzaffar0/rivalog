import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  MOBILELOGIN_FAILED,
  MOBILELOGIN_REQUEST,
  MOBILELOGIN_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* MobileLoginAsyn({ params }) {
  try {
    const response = yield call(Api.MobileLogin, params);
    yield put({ type: MOBILELOGIN_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: MOBILELOGIN_FAILED, payload: e });
  }
}

export function* MobileLoginSaga() {
  yield takeEvery(MOBILELOGIN_REQUEST, MobileLoginAsyn);
}
export default MobileLoginSaga;
