import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_FREIGHT_LOCATIONS_SUCCESS,
  GET_FREIGHT_LOCATIONS_FAILED,
  GET_FREIGHT_LOCATIONS_REQUEST,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetFreightLocationsAsync({ PageIndex, PageCount }) {
  try {
    const response = yield call(Api.GetFreightLocations, PageIndex, PageCount);
    yield put({
      type: GET_FREIGHT_LOCATIONS_SUCCESS,
      payload: response,
    });
  } catch (e) {
    yield put({ type: GET_FREIGHT_LOCATIONS_FAILED, payload: e });
  }
}

export function* GetFreightLocationsSaga() {
  yield takeEvery(GET_FREIGHT_LOCATIONS_REQUEST, GetFreightLocationsAsync);
}
export default GetFreightLocationsSaga;
