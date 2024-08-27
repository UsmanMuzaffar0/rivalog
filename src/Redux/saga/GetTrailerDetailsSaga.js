import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERDETAILS_REQUEST, GETTRAILERDETAILS_SUCCESS, GETTRAILERDETAILS_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerDetailsAsyn({TrailerID}) {
    try {
      const response = yield call(Api.GetTrailerDetails, TrailerID);
      yield put({ type: GETTRAILERDETAILS_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERDETAILS_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerDetailsSaga() {
    yield takeEvery(GETTRAILERDETAILS_REQUEST, GetTrailerDetailsAsyn);
  }
  export default GetTrailerDetailsSaga;
