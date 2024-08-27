
import {put, call, takeEvery, take} from 'redux-saga/effects';
import {EDITTRAILER_SUCCESS, EDITTRAILER_FAILED, EDITTRAILER_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* EditTrailerAsyn({params}) {
  try {
    const response = yield call(Api.EditTrailer, params);
    
    yield put({type: EDITTRAILER_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: EDITTRAILER_FAILED, payload: e});
  }
}

export function* EditTrailerSaga() {
  yield takeEvery(EDITTRAILER_REQUEST, EditTrailerAsyn);
}
export default EditTrailerSaga;