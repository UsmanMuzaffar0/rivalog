import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERTYPELIST_REQUEST, GETTRAILERTYPELIST_SUCCESS, GETTRAILERTYPELIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerTypeListAsyn({ SearchText, PageIndex, PageCount,TransportTypeId }) {
    try {
      const response = yield call(Api.GetTrailerTypeList, SearchText, PageIndex, PageCount,TransportTypeId);
      yield put({ type: GETTRAILERTYPELIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERTYPELIST_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerTypeListSaga() {
    yield takeEvery(GETTRAILERTYPELIST_REQUEST, GetTrailerTypeListAsyn);
  }
  export default GetTrailerTypeListSaga;
