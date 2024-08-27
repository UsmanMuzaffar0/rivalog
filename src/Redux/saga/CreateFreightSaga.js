import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  CREATE_FREIGHT_REQUEST,
  CREATE_FREIGHT_FAILED,
  CREATE_FREIGHT_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* CreateFreightAsync({ params }) {
  try {
    const response = yield call(Api.createFreight, params);

    yield put({ type: CREATE_FREIGHT_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: CREATE_FREIGHT_FAILED, payload: e });
  }
}

export function* CreateFreightSaga() {
  yield takeEvery(CREATE_FREIGHT_REQUEST, CreateFreightAsync);
}
export default CreateFreightSaga;
