import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETVEHICLEFILES_REQUEST, GETVEHICLEFILES_SUCCESS, GETVEHICLEFILES_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetVehicleFilesAsyn({VehicleID}) {
    try {
      const response = yield call(Api.GetVehicleFilesData, VehicleID);
      yield put({ type: GETVEHICLEFILES_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETVEHICLEFILES_FAILED, payload: e });
    }
  }
  
  export function* GetVehicleFilesSaga() {
    yield takeEvery(GETVEHICLEFILES_REQUEST, GetVehicleFilesAsyn);
  }
  export default GetVehicleFilesSaga;
