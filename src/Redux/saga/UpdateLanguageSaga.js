import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  UPDATELANG_FAILED,
  UPDATELANG_REQUEST,
  UPDATELANG_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* UpdateLanguageAsyn({ params }) {
  try {
    const response = yield call(Api.UpdateLanguage, params);

    yield put({ type: UPDATELANG_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: UPDATELANG_FAILED, payload: e });
  }
}

export function* UpdateLanguageSaga() {
  yield takeEvery(UPDATELANG_REQUEST, UpdateLanguageAsyn);
}
export default UpdateLanguageSaga;
