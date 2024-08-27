import {put, call, takeEvery, take} from 'redux-saga/effects';
import {EDITVEHICLE_REQUEST, EDITVEHICLE_SUCCESS, EDITVEHICLE_FAILED} from '../actions/types';
import Api from '../../common/Api';

export function* EditVehicleAsyn({params}) {
  try {
    const response = yield call(Api.EditVehicle, params);
    
    yield put({type: EDITVEHICLE_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: EDITVEHICLE_FAILED, payload: e});
  }
}

export function* EditVehicleSaga() {
  yield takeEvery(EDITVEHICLE_REQUEST, EditVehicleAsyn);
}
export default EditVehicleSaga;