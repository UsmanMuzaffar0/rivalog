import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CHANGEPASSWORD_FAILED,
  CHANGEPASSWORD_REQUEST,
  CHANGEPASSWORD_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* ChnagePasswordAsyn({ params }) {
  try {
    const response = yield call(Api.ChangePassword, params);

    yield put({ type: CHANGEPASSWORD_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CHANGEPASSWORD_FAILED, payload: e });
  }
}

export function* ChnagePasswordSaga() {
  yield takeEvery(CHANGEPASSWORD_REQUEST, ChnagePasswordAsyn);
}
export default ChnagePasswordSaga;
