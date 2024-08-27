import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETDRIVERFILES_REQUEST, GETDRIVERFILES_SUCCESS, GETDRIVERFILES_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetDriverFilesAsyn({DriverID}) {
    try {
      const response = yield call(Api.GetDriverFilesData, DriverID);
      yield put({ type: GETDRIVERFILES_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETDRIVERFILES_FAILED, payload: e });
    }
  }
  
  export function* GetDriverFilesSaga() {
    yield takeEvery(GETDRIVERFILES_REQUEST, GetDriverFilesAsyn);
  }
  export default GetDriverFilesSaga;
