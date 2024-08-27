import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETFREIGHTSTATUS_FAILED,
  GETFREIGHTSTATUS_SUCCESS,
  GETFREIGHTSTATUS_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightStatus({ SearchText, PageIndex, PageCount }) {
  try {
    const response = yield call(
      Api.GetFreightStatus,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({ type: GETFREIGHTSTATUS_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETFREIGHTSTATUS_FAILED, payload: e });
  }
}

export function* GetFreightStatusSaga() {
  yield takeEvery(GETFREIGHTSTATUS_REQUEST, GetFreightStatus);
}
export default GetFreightStatusSaga;
