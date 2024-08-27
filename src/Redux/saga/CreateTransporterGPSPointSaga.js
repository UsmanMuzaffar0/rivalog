import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CREATETRANSPORTERGPSPOINT_REQUEST,
  CREATETRANSPORTERGPSPOINT_SUCCESS,
  CREATETRANSPORTERGPSPOINT_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GPSPointAsync({ params }) {
  try {
    const response = yield call(Api.CreateTransporterGPSPoint, params);

    yield put({ type: CREATETRANSPORTERGPSPOINT_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CREATETRANSPORTERGPSPOINT_FAILED, payload: e });
  }
}

export function* CreateTransporterGPSPointSaga() {
  yield takeEvery(CREATETRANSPORTERGPSPOINT_REQUEST, GPSPointAsync);
}
export default CreateTransporterGPSPointSaga;
