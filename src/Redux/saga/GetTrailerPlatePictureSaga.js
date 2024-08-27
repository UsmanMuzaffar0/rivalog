import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERDETAILS_REQUEST, GETTRAILERDETAILS_SUCCESS, GETTRAILERDETAILS_FAILED, GETTRAILERPLATEPICTURE_REQUEST, GETTRAILERPLATEPICTURE_SUCCESS, GETTRAILERPLATEPICTURE_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerPlatePictureAsyn({TrailerID}) {
    try {
      const response = yield call(Api.GetTrailerPlatePictureData, TrailerID);
      yield put({ type: GETTRAILERPLATEPICTURE_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERPLATEPICTURE_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerPlatePictureSaga() {
    yield takeEvery(GETTRAILERPLATEPICTURE_REQUEST, GetTrailerPlatePictureAsyn);
  }
  export default GetTrailerPlatePictureSaga;
