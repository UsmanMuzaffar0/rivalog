import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  SETNOTIFICATIONSTATEASREAD_FAILED,
  SETNOTIFICATIONSTATEASREAD_REQUEST,
  SETNOTIFICATIONSTATEASREAD_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* SetNotificationStateAsReadAsyn({ params }) {
  try {
    const response = yield call(Api.SetNotificationStateAsRead, params);

    yield put({ type: SETNOTIFICATIONSTATEASREAD_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SETNOTIFICATIONSTATEASREAD_FAILED, payload: e });
  }
}

export function* SetNotificationStateAsReadAsynSaga() {
  yield takeEvery(
    SETNOTIFICATIONSTATEASREAD_REQUEST,
    SetNotificationStateAsReadAsyn
  );
}
export default SetNotificationStateAsReadAsynSaga;
