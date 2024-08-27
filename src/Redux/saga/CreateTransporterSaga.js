import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CREATETRANSPORTER_REQUEST,
  CREATETRANSPORTER_SUCCESS,
  CREATETRANSPORTER_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* CreateTransporterAsyn({ params }) {
  try {
    const response = yield call(Api.CreateTransporter, params);

    yield put({ type: CREATETRANSPORTER_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CREATETRANSPORTER_FAILED, payload: e });
  }
}

export function* CreateTransporterSaga() {
  yield takeEvery(CREATETRANSPORTER_REQUEST, CreateTransporterAsyn);
}
export default CreateTransporterSaga;
