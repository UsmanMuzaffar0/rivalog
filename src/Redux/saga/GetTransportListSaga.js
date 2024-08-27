import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETTRANSPORTLIST_REQUEST,
  GETTRANSPORTLIST_SUCCESS,
  GETTRANSPORTLIST_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetTransportListAsyn({ params }) {
  try {
    const response = yield call(Api.GetUserTransportList, params);
    yield put({ type: GETTRANSPORTLIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETTRANSPORTLIST_FAILED, payload: e });
  }
}

export function* GetTransportListSaga() {
  yield takeEvery(GETTRANSPORTLIST_REQUEST, GetTransportListAsyn);
}
export default GetTransportListSaga;
