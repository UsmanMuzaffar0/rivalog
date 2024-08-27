import { put, call, takeEvery, take } from 'redux-saga/effects';
import { SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* SignUpAsyn({ params }) {
  try {
    const response = yield call(Api.SignUp, params);
    yield put({ type: SIGNUP_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SIGNUP_FAILED, payload: e });
  }
}

export function* SignUpSaga() {
  yield takeEvery(SIGNUP_REQUEST, SignUpAsyn);
}
export default SignUpSaga;
