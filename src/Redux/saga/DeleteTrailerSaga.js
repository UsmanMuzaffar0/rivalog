import { put, call, takeEvery, take } from 'redux-saga/effects';
import { DELETETRAILER_REQUEST, DELETETRAILER_SUCCESS, DELETETRAILER_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* DeleteTrailerAsyn({TrailerID}) {
    try {
      const response = yield call(Api.DeleteTrailer, TrailerID);
      yield put({ type: DELETETRAILER_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: DELETETRAILER_FAILED, payload: e });
    }
  }
  
  export function* DeleteTrailerSaga() {
    yield takeEvery(DELETETRAILER_REQUEST, DeleteTrailerAsyn);
  }
  export default DeleteTrailerSaga;
