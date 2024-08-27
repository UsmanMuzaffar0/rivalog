import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CREATETRANSPORTAPPLICATION_REQUEST,
  CREATETRANSPORTAPPLICATION_SUCCESS,
  CREATETRANSPORTAPPLICATION_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* CreateTransportApplicationAsyn({ params }) {
  try {
    const response = yield call(Api.CreateTransportApplication, params);

    yield put({ type: CREATETRANSPORTAPPLICATION_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CREATETRANSPORTAPPLICATION_FAILED, payload: e });
  }
}

export function* CreateTransportApplicationSaga() {
  yield takeEvery(CREATETRANSPORTAPPLICATION_REQUEST, CreateTransportApplicationAsyn);
}
export default CreateTransportApplicationSaga;
