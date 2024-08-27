import { put, call, takeEvery, take } from 'redux-saga/effects';
import { GETCOMPANY_REQUEST, GETCOMPANY_SUCCESS, GETCOMPANY_FAILED } from '../actions/types';
import Api from '../../common/Api';

export function* getCompanyAsyn({ params }) {
  try {
    const response = yield call(Api.GetCompany, params);
    yield put({ type: GETCOMPANY_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETCOMPANY_FAILED, payload: e });
  }
}

export function* GetCompanySaga() {
  yield takeEvery(GETCOMPANY_REQUEST, getCompanyAsyn);
}
export default GetCompanySaga;
