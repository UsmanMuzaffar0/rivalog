
import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERSPECIFICATIONTYPELIST_REQUEST, GETTRAILERSPECIFICATIONTYPELIST_SUCCESS, GETTRAILERSPECIFICATIONTYPELIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerSpecificationListAsyn({TrailerTypeId, SearchText, PageIndex, PageCount}) {
    try {
      const response = yield call(Api.GetTrailerSpecificationTypeList, TrailerTypeId, SearchText, PageIndex, PageCount);
      yield put({ type: GETTRAILERSPECIFICATIONTYPELIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERSPECIFICATIONTYPELIST_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerSpecificationListSaga() {
    yield takeEvery(GETTRAILERSPECIFICATIONTYPELIST_REQUEST, GetTrailerSpecificationListAsyn);
  }
  export default GetTrailerSpecificationListSaga;
