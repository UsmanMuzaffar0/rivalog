import {put, call, takeEvery, take} from 'redux-saga/effects';
import {UPLOADVEHICLEFILE_SUCCESS, UPLOADVEHICLEFILE_FAILED, UPLOADVEHICLEFILE_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* UploadVehicleFileAsyn({VehicleId, FileTypeName, params}) {
  try {
    const response = yield call(Api.UploadVehicleFiles, VehicleId, FileTypeName, params);
    
    yield put({type: UPLOADVEHICLEFILE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: UPLOADVEHICLEFILE_FAILED, payload: e});
  }
}

export function* UploadVehicleFileSaga() {
  yield takeEvery(UPLOADVEHICLEFILE_REQUEST, UploadVehicleFileAsyn);
}
export default UploadVehicleFileSaga;