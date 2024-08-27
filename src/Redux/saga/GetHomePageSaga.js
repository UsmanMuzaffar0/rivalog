import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  HOME_PAGE_FAILED,
  HOME_PAGE_SUCCESS,
  HOME_PAGE_REQUEST,
  HOME_PAGE_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetHomePage({}) {
  try {
    yield put({ type: HOME_PAGE_LOADER, payload: null });
    const response = yield call(Api.GetHomePage);
    yield put({ type: HOME_PAGE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: HOME_PAGE_FAILED, payload: e });
  }
}

export function* GetHomePageSaga() {
  yield takeEvery(HOME_PAGE_REQUEST, GetHomePage);
}
export default GetHomePageSaga;
