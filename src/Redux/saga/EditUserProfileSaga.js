import {put, call, takeEvery, take} from 'redux-saga/effects';
import {EDITUSERPROFILE_SUCCESS, EDITUSERPROFILE_FAILED, EDITUSERPROFILE_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* EditUserProfileAsyn({params}) {
  try {
    const response = yield call(Api.EditUserProfileData, params);
    
    yield put({type: EDITUSERPROFILE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: EDITUSERPROFILE_FAILED, payload: e});
  }
}

export function* EditUserProfileSaga() {
  yield takeEvery(EDITUSERPROFILE_REQUEST, EditUserProfileAsyn);
}
export default EditUserProfileSaga;