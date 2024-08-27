import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_CURRENCY_LIST_REQUEST,
  GET_CURRENCY_LIST_FAILED,
  GET_CURRENCY_LIST_SUCCESS,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetCurrencyListAsync({ params }) {
  try {
    const response = yield call(Api.GetCurrencyList, params);
    yield put({ type: GET_CURRENCY_LIST_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: GET_CURRENCY_LIST_FAILED, payload: e });
  }
}

export function* GetCurrencyListSaga() {
  yield takeEvery(GET_CURRENCY_LIST_REQUEST, GetCurrencyListAsync);
}
export default GetCurrencyListSaga;
