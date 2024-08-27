import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  UPDATETRANSPORTERSTATUS_FAILED,
  UPDATETRANSPORTERSTATUS_REQUEST,
  UPDATETRANSPORTERSTATUS_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* UpdateTransporterStatusAsyn({ params }) {
  try {
    const response = yield call(Api.UpdateTransporterStatus, params);
    yield put({ type: UPDATETRANSPORTERSTATUS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: UPDATETRANSPORTERSTATUS_FAILED, payload: e });
  }
}

export function* UpdateTransporterStatusSaga() {
  yield takeEvery(UPDATETRANSPORTERSTATUS_REQUEST, UpdateTransporterStatusAsyn);
}
export default UpdateTransporterStatusSaga;
