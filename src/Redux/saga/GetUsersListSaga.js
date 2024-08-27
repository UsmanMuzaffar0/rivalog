import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETUSERLIST_SUCCESS,
  GETUSERLIST_REQUEST,
  GETUSERLIST_FAILED,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetUsersList({
  SearchText,
  PageIndex,
  PageCount,
  FilterOptions,
}) {
  try {
    const response = yield call(
      Api.GetUsersList,
      SearchText,
      PageIndex,
      PageCount,
      FilterOptions
    );
    yield put({ type: GETUSERLIST_SUCCESS, payload: response });
  } catch (e) {
    console.error(e);
    yield put({ type: GETUSERLIST_FAILED, payload: e });
  }
}

export function* GetUserListSaga() {
  yield takeEvery(GETUSERLIST_REQUEST, GetUsersList);
}
export default GetUserListSaga;
