import { put, call, takeEvery, take } from 'redux-saga/effects';
import { SETASPRIMARY_REQUEST, SETASPRIMARY_SUCCESS, SETASPRIMARY_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* SetAsPrimaryAsyn({ params }) {

  try {
    const response = yield call(Api.SetAsPrimary, params);
    yield put({ type: SETASPRIMARY_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SETASPRIMARY_FAILED, payload: e });
  }
}

export function* SetAsPrimarySaga() {
  yield takeEvery(SETASPRIMARY_REQUEST, SetAsPrimaryAsyn);
}
export default SetAsPrimarySaga;
