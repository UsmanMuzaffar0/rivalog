import {put, call, takeEvery, take} from 'redux-saga/effects';
import {ADDVEHICLE_REQUEST, ADDVEHICLE_SUCCESS, ADDVEHICLE_FAILED} from '../actions/types';
import Api from '../../common/Api';

export function* AddVehicleAsyn({params}) {
  try {
    const response = yield call(Api.AddVehicle, params);
    
    yield put({type: ADDVEHICLE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: ADDVEHICLE_FAILED, payload: e});
  }
}

export function* AddVehicleSaga() {
  yield takeEvery(ADDVEHICLE_REQUEST, AddVehicleAsyn);
}
export default AddVehicleSaga;