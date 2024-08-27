import {put, call, takeEvery, take} from 'redux-saga/effects';
import {ADDTRAILER_SUCCESS, ADDTRAILER_FAILED, ADDTRAILER_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* AddTrailerAsyn({params}) {
  try {
    const response = yield call(Api.AddTrailer, params);
    
    yield put({type: ADDTRAILER_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: ADDTRAILER_FAILED, payload: e});
  }
}

export function* AddTrailerSaga() {
  yield takeEvery(ADDTRAILER_REQUEST, AddTrailerAsyn);
}
export default AddTrailerSaga;