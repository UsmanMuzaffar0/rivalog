import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETLANG_REQUEST, GETLANG_SUCCESS, GETLANG_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* LanguageAsyn({ params }) {
  try {
    const response = yield call(Api.Language, params);
    yield put({ type: GETLANG_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETLANG_FAILED, payload: e });
  }
}

export function* GetLangSaga() {
  yield takeEvery(GETLANG_REQUEST, LanguageAsyn);
}
export default GetLangSaga;
