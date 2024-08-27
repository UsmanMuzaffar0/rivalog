import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GETFREIGHTSIGNEDLIST_SUCCESS,
  GETFREIGHTSIGNEDLIST_FAILED,
  GETFREIGHTSIGNEDLIST_REQUEST,
  GETFREIGHTSIGNEDLIST_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightSignedListAsyn({
  SearchText,
  PageIndex,
  PageCount,
  FilterOptions,
}) {
  yield put({ type: GETFREIGHTSIGNEDLIST_LOADER, payload: null });
  try {
    const response = yield call(
      Api.GetFreightSignedList,
      SearchText,
      PageIndex,
      PageCount
    );

    console.log("Yaa ALLAH Maddadd>>>>>", response);
    yield put({ type: GETFREIGHTSIGNEDLIST_SUCCESS, payload: response });
    console.log("Yaa ALLAH Maddadd>>>>>", response);
  } catch (e) {
    yield put({ type: GETFREIGHTSIGNEDLIST_FAILED, payload: e });
  }
}

export function* GetFreightSignedListSaga() {
  yield takeEvery(GETFREIGHTSIGNEDLIST_REQUEST, GetFreightSignedListAsyn);
}
export default GetFreightSignedListSaga;
