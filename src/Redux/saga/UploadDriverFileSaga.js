import {put, call, takeEvery, take} from 'redux-saga/effects';
import {UPLOADDRIVERFILE_SUCCESS, UPLOADDRIVERFILE_FAILED, UPLOADDRIVERFILE_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* UploadDriverFileAsyn({DriverId, FileTypeName, params}) {
  try {
    const response = yield call(Api.UploadDriverFiles, DriverId, FileTypeName, params);
    
    yield put({type: UPLOADDRIVERFILE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: UPLOADDRIVERFILE_FAILED, payload: e});
  }
}

export function* UploadDriverFileSaga() {
  yield takeEvery(UPLOADDRIVERFILE_REQUEST, UploadDriverFileAsyn);
}
export default UploadDriverFileSaga;