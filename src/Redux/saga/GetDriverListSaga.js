import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETDRIVERLIST_REQUEST, GETDRIVERLIST_SUCCESS, GETDRIVERLIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetDriverListAsyn({SearchText, PageIndex, PageCount}) {
    try {
      const response = yield call(Api.GetDriverList, SearchText, PageIndex, PageCount);
      yield put({ type: GETDRIVERLIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETDRIVERLIST_FAILED, payload: e });
    }
  }
  
  export function* GetDriverListSaga() {
    yield takeEvery(GETDRIVERLIST_REQUEST, GetDriverListAsyn);
  }
  export default GetDriverListSaga;