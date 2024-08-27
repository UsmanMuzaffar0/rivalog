import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETCOUNTRY_REQUEST, GETCOUNTRY_SUCCESS, GETCOUNTRY_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetCountryAsyn({ params }) {
  try {
    const response = yield call(Api.GetCountry, params);
    yield put({ type: GETCOUNTRY_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETCOUNTRY_FAILED, payload: e });
  }
}

export function* GetCountrySaga() {
  yield takeEvery(GETCOUNTRY_REQUEST, GetCountryAsyn);
}
export default GetCountrySaga;
