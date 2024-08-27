import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETVEHICLELIST_REQUEST, GETVEHICLELIST_SUCCESS, GETVEHICLELIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetVehicleListAsyn({SearchText, PageIndex, PageCount}) {
    try {
      const response = yield call(Api.GetVehicleList, SearchText, PageIndex, PageCount);
      yield put({ type: GETVEHICLELIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETVEHICLELIST_FAILED, payload: e });
    }
  }
  
  export function* GetVehicleListSaga() {
    yield takeEvery(GETVEHICLELIST_REQUEST, GetVehicleListAsyn);
  }
  export default GetVehicleListSaga;