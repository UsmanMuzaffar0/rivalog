import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  DELETEUSERLIST_REQUEST,
  DELETEUSERLIST_SUCCESS,
  DELETEUSERLIST_FAILED,
  DELETEUSERLIST_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* DeleteUserAsyn({ params }) {
  try {
    yield put({ type: DELETEUSERLIST_LOADER, payload: null });

    const response = yield call(Api.DeleteUser, params);
    yield put({ type: DELETEUSERLIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: DELETEUSERLIST_FAILED, payload: e });
  }
}

export function* DeleteUserSaga() {
  yield takeEvery(DELETEUSERLIST_REQUEST, DeleteUserAsyn);
}
export default DeleteUserSaga;
