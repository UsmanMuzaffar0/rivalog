import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETPREFFEREDROUTE_FAILED,
  GETPREFFEREDROUTE_SUCCESS,
  GETPREFFEREDROUTE_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetPrefferedRouteAsyn({ params }) {
  try {
    const response = yield call(Api.GetPrefferedRoute, params);

    yield put({ type: GETPREFFEREDROUTE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETPREFFEREDROUTE_FAILED, payload: e });
  }
}

export function* GetPrefferedRouteSaga() {
  yield takeEvery(GETPREFFEREDROUTE_REQUEST, GetPrefferedRouteAsyn);
}
export default GetPrefferedRouteSaga;


