import { put, call, takeEvery, take } from 'redux-saga/effects';
import { DELETEVEHICLE_REQUEST, DELETEVEHICLE_SUCCESS, DELETEVEHICLE_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* DeleteVehicleAsyn({VehicleID}) {
    try {
      const response = yield call(Api.DeleteVehicle, VehicleID);
      yield put({ type: DELETEVEHICLE_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: DELETEVEHICLE_FAILED, payload: e });
    }
  }
  
  export function* DeleteVehicleSaga() {
    yield takeEvery(DELETEVEHICLE_REQUEST, DeleteVehicleAsyn);
  }
  export default DeleteVehicleSaga;
