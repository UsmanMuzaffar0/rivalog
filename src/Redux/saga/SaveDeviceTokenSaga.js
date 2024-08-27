import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  SAVEDEVICETOKEN_FAILED,
  SAVEDEVICETOKEN_SUCCESS,
  SAVEDEVICETOKEN_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* SaveDeviceTokenAsyn({ params }) {
  try {
    const response = yield call(Api.SaveUserDeviceToken, params);

    yield put({ type: SAVEDEVICETOKEN_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: SAVEDEVICETOKEN_FAILED, payload: e });
  }
}

export function* SaveDeviceTokenSaga() {
  yield takeEvery(SAVEDEVICETOKEN_REQUEST, SaveDeviceTokenAsyn);
}
export default SaveDeviceTokenSaga;