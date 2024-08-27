import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  UPDATEPREFFEREDROUTE_FAILED,
  UPDATEPREFFEREDROUTE_REQUEST,
  UPDATEPREFFEREDROUTE_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* UpdatePrefferedRouteAsyn({ params }) {
  try {
    const response = yield call(Api.UpdatePrefferedRoute, params);

    yield put({ type: UPDATEPREFFEREDROUTE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: UPDATEPREFFEREDROUTE_FAILED, payload: e });
  }
}

export function* UpdatePrefferedRouteSaga() {
  yield takeEvery(UPDATEPREFFEREDROUTE_REQUEST, UpdatePrefferedRouteAsyn);
}
export default UpdatePrefferedRouteSaga;
