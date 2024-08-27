import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CREATEUSERLIST_FAILED,
  CREATEUSERLIST_SUCCESS,
  CREATEUSERLIST_REQUEST,
  CREATEUSERLIST_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* CreateNewUser({ params }) {
  try {
    yield put({ type: CREATEUSERLIST_LOADER, payload: null });

    const response = yield call(Api.CreateUser, params);

    yield put({ type: CREATEUSERLIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CREATEUSERLIST_FAILED, payload: e });
  }
}

export function* CreateNewUserSaga() {
  yield takeEvery(CREATEUSERLIST_REQUEST, CreateNewUser);
}
export default CreateNewUserSaga;
