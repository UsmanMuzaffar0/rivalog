import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETTRAILERLIST_REQUEST, GETTRAILERLIST_SUCCESS, GETTRAILERLIST_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* GetTrailerListAsyn({SearchText, PageIndex, PageCount}) {
    try {
      const response = yield call(Api.GetTrailerList, SearchText, PageIndex, PageCount);
      yield put({ type: GETTRAILERLIST_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: GETTRAILERLIST_FAILED, payload: e });
    }
  }
  
  export function* GetTrailerListSaga() {
    yield takeEvery(GETTRAILERLIST_REQUEST, GetTrailerListAsyn);
  }
  export default GetTrailerListSaga;