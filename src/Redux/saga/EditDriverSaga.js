import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  EDITDRIVER_REQUEST,
  EDITDRIVER_SUCCESS,
  EDITDRIVER_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* EditDriverAsyn({ params }) {
  console.log(params, "edit driver saga");
  try {
    const response = yield call(Api.EditDriver, params);

    yield put({ type: EDITDRIVER_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: EDITDRIVER_FAILED, payload: e });
  }
}

export function* EditDriverSaga() {
  yield takeEvery(EDITDRIVER_REQUEST, EditDriverAsyn);
}
export default EditDriverSaga;
