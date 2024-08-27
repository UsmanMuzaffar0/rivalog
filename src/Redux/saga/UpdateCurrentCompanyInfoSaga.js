import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  UPDATECURRENTCOMPANYINFO_REQUEST,
  UPDATECURRENTCOMPANYINFO_SUCCESS,
  UPDATECURRENTCOMPANYINFO_FAILED,
  UPDATECURRENTCOMPANYINFO_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* UpdateCurrentCompanyInfoAsyn({ params }) {
  try {
    yield put({ type: UPDATECURRENTCOMPANYINFO_LOADER, payload: null });
    const response = yield call(Api.UpdateCurrentCompanyInfo, params);
    yield put({ type: UPDATECURRENTCOMPANYINFO_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: UPDATECURRENTCOMPANYINFO_FAILED, payload: e });
  }
}

export function* UpdateCurrentCompanyInfoSaga() {
  yield takeEvery(
    UPDATECURRENTCOMPANYINFO_REQUEST,
    UpdateCurrentCompanyInfoAsyn
  );
}
export default UpdateCurrentCompanyInfoSaga;
