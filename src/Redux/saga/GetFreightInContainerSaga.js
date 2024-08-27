import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_FREIGHT_IN_CONTAINER_SUCCESS,
  GET_FREIGHT_IN_CONTAINER_FAILED,
  GET_FREIGHT_IN_CONTAINER_REQUEST,
  GET_FREIGHT_IN_CONTAINER_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightInContainerAsyn({ containerId }) {
  try {
    yield put({ type: GET_FREIGHT_IN_CONTAINER_LOADER, payload: null });
    const response = yield call(Api.GetFreightInContainer, containerId);
    yield put({
      type: GET_FREIGHT_IN_CONTAINER_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_FREIGHT_IN_CONTAINER_FAILED, payload: e });
  }
}

export function* GetFreightInContainerSaga() {
  yield takeEvery(GET_FREIGHT_IN_CONTAINER_REQUEST, GetFreightInContainerAsyn);
}
export default GetFreightInContainerSaga;
