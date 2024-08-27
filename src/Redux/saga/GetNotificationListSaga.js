import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETNOTIFICATIONLIST_FAILED,
  GETNOTIFICATIONLIST_REQUEST,
  GETNOTIFICATIONLIST_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetNotificationListAsyn({ params }) {
  try {
    const response = yield call(Api.GetNotificationList, params);

    yield put({ type: GETNOTIFICATIONLIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETNOTIFICATIONLIST_FAILED, payload: e });
  }
}

export function* GetNotificationListSaga() {
  yield takeEvery(GETNOTIFICATIONLIST_REQUEST, GetNotificationListAsyn);
}
export default GetNotificationListSaga;
