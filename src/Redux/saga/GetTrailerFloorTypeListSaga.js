import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERFLOORTYPELIST_REQUEST, GETTRAILERFLOORTYPELIST_SUCCESS, GETTRAILERFLOORTYPELIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerFloorTypeListAsyn({SearchText, PageIndex, PageCount}) {
    try {
      const response = yield call(Api.GetTrailerFloorTypeList, SearchText, PageIndex, PageCount);
      yield put({ type: GETTRAILERFLOORTYPELIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERFLOORTYPELIST_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerFloorTypeListSaga() {
    yield takeEvery(GETTRAILERFLOORTYPELIST_REQUEST, GetTrailerFloorTypeListAsyn);
  }
  export default GetTrailerFloorTypeListSaga;