import {put, call, takeEvery, take} from 'redux-saga/effects';
import {USERNAMELOGIN_FAILED,USERNAMELOGIN_REQUEST,USERNAMELOGIN_SUCCESS} from '../actions/types';
import Api from '../../common/Api';

export function* UsernameLoginAsyn({params}) {

  try {
    const response = yield call(Api.UsernameLogin, params);
    yield put({type: USERNAMELOGIN_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: USERNAMELOGIN_FAILED, payload: e});
  }
}

export function* UsernameLoginSaga() {
  yield takeEvery(USERNAMELOGIN_REQUEST, UsernameLoginAsyn);
}
export default UsernameLoginSaga;
