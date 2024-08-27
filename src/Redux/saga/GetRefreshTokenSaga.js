import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETREFRESHTOKEN_FAILED,
  GETREFRESHTOKEN_SUCCESS,
  GETREFRESHTOKEN_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";


export function* GetRefreshTokenAsyn({ params }) {
  try {
    const response = yield call(Api.GetRefreshToken, params);

    yield put({ type: GETREFRESHTOKEN_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETREFRESHTOKEN_FAILED, payload: e });
  }
}

export function* GetRefreshTokenSaga() {
  yield takeEvery(GETREFRESHTOKEN_REQUEST, GetRefreshTokenAsyn);
}
export default GetRefreshTokenSaga;


