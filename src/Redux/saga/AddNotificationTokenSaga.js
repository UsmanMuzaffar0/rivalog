import { put, call, takeEvery, take } from 'redux-saga/effects';
import { NOTIFICATIONTOKEN_FAILED, NOTIFICATIONTOKEN_SUCCESS, NOTIFICATIONTOKEN_REQUEST } from '../actions/types';
import Api from '../../common/Api';

export function* NotificationTokenAsyn({ params }) {
  try {
    const response = yield call(Api.SetNotificationToken, params);

    yield put({ type: NOTIFICATIONTOKEN_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: NOTIFICATIONTOKEN_FAILED, payload: e });
  }
}

export function* AddNotificationTokenSaga() {
  yield takeEvery(NOTIFICATIONTOKEN_REQUEST, NotificationTokenAsyn);
}
export default AddNotificationTokenSaga;