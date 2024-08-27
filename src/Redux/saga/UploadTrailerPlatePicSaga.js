import {put, call, takeEvery, take} from 'redux-saga/effects';
import {UPLOADTRAILERPLATEPIC_SUCCESS, UPLOADTRAILERPLATEPIC_FAILED, UPLOADTRAILERPLATEPIC_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* UploadTrailerPlatePicAsyn({TrailerId, params}) {
  try {
    const response = yield call(Api.UploadTrailerPlatePicture, TrailerId, params);
    
    yield put({type: UPLOADTRAILERPLATEPIC_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: UPLOADTRAILERPLATEPIC_FAILED, payload: e});
  }
}

export function* UploadTrailerPlatePicSaga() {
  yield takeEvery(UPLOADTRAILERPLATEPIC_REQUEST, UploadTrailerPlatePicAsyn);
}
export default UploadTrailerPlatePicSaga;