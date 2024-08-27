import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  DELETEPREFFEREDROUTE_FAILED,
  DELETEPREFFEREDROUTE_SUCCESS,
  DELETEPREFFEREDROUTE_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* DeletePrefferedRouteAsyn({ params }) {
  try {
    const response = yield call(Api.DeletePrefferedRoute, params);

    yield put({ type: DELETEPREFFEREDROUTE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: DELETEPREFFEREDROUTE_FAILED, payload: e });
  }
}

export function* DeletePrefferedRouteSaga() {
  yield takeEvery(DELETEPREFFEREDROUTE_REQUEST, DeletePrefferedRouteAsyn);
}
export default DeletePrefferedRouteSaga;
