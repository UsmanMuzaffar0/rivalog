import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  ADDPREFFEREDROUTE_FAILED,
  ADDPREFFEREDROUTE_SUCCESS,
  ADDPREFFEREDROUTE_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* AddPrefferedRouteAsyn({ params }) {
  try {
    const response = yield call(Api.AddPrefferedRoute, params);

    yield put({ type: ADDPREFFEREDROUTE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: ADDPREFFEREDROUTE_FAILED, payload: e });
  }
}

export function* AddPrefferedRouteSaga() {
  yield takeEvery(ADDPREFFEREDROUTE_REQUEST, AddPrefferedRouteAsyn);
}
export default AddPrefferedRouteSaga;
