import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETCURRENTCOMPANYINFO_REQUEST,
  GETCURRENTCOMPANYINFO_SUCCESS,
  GETCURRENTCOMPANYINFO_FAILED,
  GETCURRENTCOMPANYINFO_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetCurrentCompanyInfoAsyn({ params }) {
  try {
    yield put({ type: GETCURRENTCOMPANYINFO_LOADER, payload: null });
    const response = yield call(Api.GetCurrentCompanyInfo, params);
    yield put({ type: GETCURRENTCOMPANYINFO_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GETCURRENTCOMPANYINFO_FAILED, payload: e });
  }
}

export function* GetCurrentCompanyInfoSaga() {
  yield takeEvery(GETCURRENTCOMPANYINFO_REQUEST, GetCurrentCompanyInfoAsyn);
}
export default GetCurrentCompanyInfoSaga;
