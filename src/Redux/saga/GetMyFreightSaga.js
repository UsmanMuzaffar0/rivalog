import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETMYFREIGHT_FAILED,
  GETMYFREIGHT_SUCCESS,
  GETMYFREIGHT_REQUEST,
  GETMYFREIGHT_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetMyFreight({
  SearchText,
  PageIndex,
  PageCount,
  freightStatusId,
  companyId,
}) {
  try {
    yield put({ type: GETMYFREIGHT_LOADER, payload: null });
    const response = yield call(
      Api.GetMyFreight,
      SearchText,
      PageIndex,
      PageCount,
      freightStatusId,
      companyId
    );
    yield put({ type: GETMYFREIGHT_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETMYFREIGHT_FAILED, payload: e });
  }
}

export function* GetMyFreightSaga() {
  yield takeEvery(GETMYFREIGHT_REQUEST, GetMyFreight);
}
export default GetMyFreightSaga;
