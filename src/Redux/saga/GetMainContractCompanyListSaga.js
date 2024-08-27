import { put, call, takeEvery, take } from "redux-saga/effects";
import {
  GET_MAIN_CONTRACT_COMPANY_LIST_FAILED,
  GET_MAIN_CONTRACT_COMPANY_LIST_SUCCESS,
  GET_MAIN_CONTRACT_COMPANY_LIST_REQUEST,
  GET_MAIN_CONTRACT_COMPANY_LIST_LOADER,
} from "../actions/types";
import Api from "../../common/Api";

export function* GetMainContractCompanyList({
  SearchText,
  PageIndex,
  PageCount,
}) {
  try {
    yield put({ type: GET_MAIN_CONTRACT_COMPANY_LIST_LOADER, payload: null });
    const response = yield call(
      Api.GetMainContainerCompanyList,
      SearchText,
      PageIndex,
      PageCount
    );
    console.log("Response", response);
    yield put({
      type: GET_MAIN_CONTRACT_COMPANY_LIST_SUCCESS,
      payload: response,
    });
  } catch (e) {
    console.log("Errr: " + e);
    yield put({ type: GET_MAIN_CONTRACT_COMPANY_LIST_FAILED, payload: e });
  }
}

export function* GetMainContrctCompanyListSaga() {
  yield takeEvery(
    GET_MAIN_CONTRACT_COMPANY_LIST_REQUEST,
    GetMainContractCompanyList
  );
}
export default GetMainContrctCompanyListSaga;
