import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  ADD_NEW_INVOICE_ADDRESS_FAILED,
  ADD_NEW_INVOICE_ADDRESS_LOADER,
  ADD_NEW_INVOICE_ADDRESS_REQUEST,
  ADD_NEW_INVOICE_ADDRESS_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* AddNewInvoiceAddress({ params }) {
  try {
    yield put({ type: ADD_NEW_INVOICE_ADDRESS_LOADER, payload: null });
    const response = yield call(Api.AddNewInvoiceAddress, params);

    yield put({ type: ADD_NEW_INVOICE_ADDRESS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: ADD_NEW_INVOICE_ADDRESS_FAILED, payload: e });
  }
}

export function* AddNewInvoiceAddressSaga() {
  yield takeEvery(ADD_NEW_INVOICE_ADDRESS_REQUEST, AddNewInvoiceAddress);
}
export default AddNewInvoiceAddressSaga;
