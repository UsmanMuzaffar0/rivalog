import {put, call, takeEvery, take} from 'redux-saga/effects';
import {DELETEBANKACCOUNT_SUCCESS, DELETEBANKACCOUNT_FAILED, DELETEBANKACCOUNT_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* DeleteBankAccountAsyn({BankAccountID}) {
  try {
    const response = yield call(Api.DeleteBankAccount, BankAccountID);
    
    yield put({type: DELETEBANKACCOUNT_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: DELETEBANKACCOUNT_FAILED, payload: e});
  }
}

export function* DeleteBankAccountSaga() {
  yield takeEvery(DELETEBANKACCOUNT_REQUEST, DeleteBankAccountAsyn);
}
export default DeleteBankAccountSaga;