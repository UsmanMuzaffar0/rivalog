import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETBANKACCOUNTLIST_SUCCESS,
  GETBANKACCOUNTLIST_FAILED,
  GETBANKACCOUNTLIST_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetBankAccountListAsyn({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetBankAccountList,
      SearchText,
      PageIndex,
      PageCount
    );

    yield put({ type: GETBANKACCOUNTLIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETBANKACCOUNTLIST_FAILED, payload: e });
  }
}

export function* GetBankAccountListSaga() {
  yield takeEvery(GETBANKACCOUNTLIST_REQUEST, GetBankAccountListAsyn);
}
export default GetBankAccountListSaga;
