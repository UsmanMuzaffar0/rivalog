import {put, call, takeEvery, take} from 'redux-saga/effects';
import {EMAILLOGIN_REQUEST, EMAILLOGIN_SUCCESS, EMAILLOGIN_FAILED} from '../actions/types';
import Api from '../../common/Api';

export function* LoginAsyn({params}) {
  
  try {
    const response = yield call(Api.Login, params);
    yield put({type: EMAILLOGIN_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: EMAILLOGIN_FAILED, payload: e});
  }
}

export function* LoginSaga() {
  yield takeEvery(EMAILLOGIN_REQUEST, LoginAsyn);
}
export default LoginSaga;
