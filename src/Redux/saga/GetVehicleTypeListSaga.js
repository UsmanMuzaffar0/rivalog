import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETVEHICLETYPELIST_REQUEST, GETVEHICLETYPELIST_SUCCESS, GETVEHICLETYPELIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetVehicleTypeListAsyn({ SearchText, PageIndex, PageCount }) {
    try {
      const response = yield call(Api.GetVehicleTypeList, SearchText, PageIndex, PageCount);
      yield put({ type: GETVEHICLETYPELIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETVEHICLETYPELIST_FAILED, payload: e });
    }
  }
  
  export function* GetVehicleTypeListSaga() {
    yield takeEvery(GETVEHICLETYPELIST_REQUEST, GetVehicleTypeListAsyn);
  }
  export default GetVehicleTypeListSaga;
