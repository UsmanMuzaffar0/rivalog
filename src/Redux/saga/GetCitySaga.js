import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETCITY_FAILED, GETCITY_REQUEST, GETCITY_SUCCESS } from '../actions/types';
import Api from '../../common/Api';

export function* GetCityAsyn({ params }) {
  try {
    const response = yield call(Api.GetCity, params);
    yield put({ type: GETCITY_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETCITY_FAILED, payload: e });
  }
}

export function* GetCitySaga() {
  yield takeEvery(GETCITY_REQUEST, GetCityAsyn);
}
export default GetCitySaga;
