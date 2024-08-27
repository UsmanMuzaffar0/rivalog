import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETADDRESS_FAILED,
  GETADDRESS_REQUEST,
  GETADDRESS_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetAddressAsyn({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetAddress,
      SearchText,
      PageIndex,
      PageCount
    );
 
    yield put({ type: GETADDRESS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETADDRESS_FAILED, payload: e });
  }
}

export function* GetAddressListSaga() {
  yield takeEvery(GETADDRESS_REQUEST, GetAddressAsyn);
}
export default GetAddressListSaga;
