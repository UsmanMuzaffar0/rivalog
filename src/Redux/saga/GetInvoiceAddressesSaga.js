import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETINVOICEADDRESSES_FAILED,
  GETINVOICEADDRESSES_LOADER,
  GETINVOICEADDRESSES_REQUEST,
  GETINVOICEADDRESSES_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetInvoiceAddresses({ SearchText, PageIndex, PageCount }) {
  try {
    yield put({ type: GETINVOICEADDRESSES_LOADER, payload: null });
    const response = yield call(
      Api.GetInvoiceAddresses,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({ type: GETINVOICEADDRESSES_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETINVOICEADDRESSES_FAILED, payload: e });
  }
}

export function* GetInvoiceAddressesSaga() {
  yield takeEvery(GETINVOICEADDRESSES_REQUEST, GetInvoiceAddresses);
}
export default GetInvoiceAddressesSaga;
