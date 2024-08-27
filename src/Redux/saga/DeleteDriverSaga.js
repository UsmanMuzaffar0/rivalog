import { put, call, takeEvery, take } from 'redux-saga/effects';
import { DELETEDRIVER_REQUEST, DELETEDRIVER_SUCCESS, DELETEDRIVER_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* DeleteDriverAsyn({DriverID}) {
    try {
      const response = yield call(Api.DeleteDriver, DriverID);
      yield put({ type: DELETEDRIVER_SUCCESS, payload: response });
    } catch (e) {
      yield put({ type: DELETEDRIVER_FAILED, payload: e });
    }
  }
  
  export function* DeleteDriverSaga() {
    yield takeEvery(DELETEDRIVER_REQUEST, DeleteDriverAsyn);
  }
  export default DeleteDriverSaga;
