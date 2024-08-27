import {put, call, takeEvery, take} from 'redux-saga/effects';
import {ADDBANKACCOUNT_SUCCESS, ADDBANKACCOUNT_FAILED, ADDBANKACCOUNT_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* AddBankAccountAsyn({params}) {
  try {
    const response = yield call(Api.AddBankAccount, params);
    
    yield put({type: ADDBANKACCOUNT_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: ADDBANKACCOUNT_FAILED, payload: e});
  }
}

export function* AddBankAccountSaga() {
  yield takeEvery(ADDBANKACCOUNT_REQUEST, AddBankAccountAsyn);
}
export default AddBankAccountSaga;