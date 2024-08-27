import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  DASHBOARD_REQUEST,
  DASHBOARD_SUCCESS,
  DASHBOARD_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetDashboardAsyn({ params }) {
  try {
    const response = yield call(Api.GetDashboard, params);

    yield put({ type: DASHBOARD_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: DASHBOARD_FAILED, payload: e });
  }
}

export function* GetDashboardSaga() {
  yield takeEvery(DASHBOARD_REQUEST, GetDashboardAsyn);
}
export default GetDashboardSaga;
