import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  UPDATE_INVOICE_ADDRESS_FAILED,
  UPDATE_INVOICE_ADDRESS_LOADER,
  UPDATE_INVOICE_ADDRESS_REQUEST,
  UPDATE_INVOICE_ADDRESS_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* UpdateInvoiceAddress({ params }) {
  try {
    yield put({ type: UPDATE_INVOICE_ADDRESS_LOADER, payload: null });
    const response = yield call(Api.UpdateInvoiceAddress, params);

    yield put({ type: UPDATE_INVOICE_ADDRESS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: UPDATE_INVOICE_ADDRESS_FAILED, payload: e });
  }
}

export function* UpdateInvoiceAddressSaga() {
  yield takeEvery(UPDATE_INVOICE_ADDRESS_REQUEST, UpdateInvoiceAddress);
}
export default UpdateInvoiceAddressSaga;
