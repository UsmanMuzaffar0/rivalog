import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETUSERDETAIS_REQUEST,
  GETUSERDETAIS_SUCCESS,
  GETUSERDETAIS_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetUserDetailsAsyn({ params }) {
  try {
    const response = yield call(Api.GetUserDetails, params);
    yield put({ type: GETUSERDETAIS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETUSERDETAIS_FAILED, payload: e });
  }
}

export function* GetUserDetailsSaga() {
  yield takeEvery(GETUSERDETAIS_REQUEST, GetUserDetailsAsyn);
}
export default GetUserDetailsSaga;
