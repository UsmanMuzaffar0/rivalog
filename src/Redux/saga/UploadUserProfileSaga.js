import {put, call, takeEvery, take} from 'redux-saga/effects';
import {UPLOADUSERPROFILE_SUCCESS, UPLOADUSERPROFILE_FAILED, UPLOADUSERPROFILE_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* UploadUserProfileAsyn({params}) {
  try {
    const response = yield call(Api.UploadUserProfile, params);
    
    yield put({type: UPLOADUSERPROFILE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: UPLOADUSERPROFILE_FAILED, payload: e});
  }
}

export function* UploadUserProfileSaga() {
  yield takeEvery(UPLOADUSERPROFILE_REQUEST, UploadUserProfileAsyn);
}

export default UploadUserProfileSaga;