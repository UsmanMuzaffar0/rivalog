import {put, call, takeEvery, take} from 'redux-saga/effects';
import {EDITBANKACCOUNT_SUCCESS, EDITBANKACCOUNT_FAILED, EDITBANKACCOUNT_REQUEST} from '../actions/types';
import Api from '../../common/Api';

export function* EditBankAccountAsyn({params}) {
  try {
    const response = yield call(Api.EditBankAccount, params);
    
    yield put({type: EDITBANKACCOUNT_SUCCESS, payload: response});
  } catch (e) {
    yield put({type: EDITBANKACCOUNT_FAILED, payload: e});
  }
}

export function* EditBankAccountSaga() {
  yield takeEvery(EDITBANKACCOUNT_REQUEST, EditBankAccountAsyn);
}
export default EditBankAccountSaga;