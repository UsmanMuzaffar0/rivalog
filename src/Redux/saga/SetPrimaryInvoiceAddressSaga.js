import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  SET_PRIMARY_INVOICE_ADDRESS_SUCCESS,
  SET_PRIMARY_INVOICE_ADDRESS_REQUEST,
  SET_PRIMARY_INVOICE_ADDRESS_FAILED,
  SET_PRIMARY_INVOICE_ADDRESS_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* SetPrimaryInvoiceAddress({ params }) {
  try {
    yield put({ type: SET_PRIMARY_INVOICE_ADDRESS_LOADER, payload: null });
    const response = yield call(Api.SetPrimaryInvoiceAddress, params);

    yield put({ type: SET_PRIMARY_INVOICE_ADDRESS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SET_PRIMARY_INVOICE_ADDRESS_FAILED, payload: e });
  }
}

export function* SetPrimaryInvoiceAddressSaga() {
  yield takeEvery(
    SET_PRIMARY_INVOICE_ADDRESS_REQUEST,
    SetPrimaryInvoiceAddress
  );
}
export default SetPrimaryInvoiceAddressSaga;
