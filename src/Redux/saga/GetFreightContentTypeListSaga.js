import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_FREIGHT_CONTENT_TYPE_LIST_SUCCESS,
  GET_FREIGHT_CONTENT_TYPE_LIST_FAILED,
  GET_FREIGHT_CONTENT_TYPE_LIST_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightContentTypeListAsync({
  SearchText,
  PageIndex,
  PageCount,
}) {
  try {
    const response = yield call(
      Api.GetFreightContentTypeList,
      SearchText,
      PageIndex,
      PageCount
    );
    yield put({
      type: GET_FREIGHT_CONTENT_TYPE_LIST_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_FREIGHT_CONTENT_TYPE_LIST_FAILED, payload: e });
  }
}

export function* GetFreightContentTypeListSaga() {
  yield takeEvery(
    GET_FREIGHT_CONTENT_TYPE_LIST_REQUEST,
    GetFreightContentTypeListAsync
  );
}
export default GetFreightContentTypeListSaga;
