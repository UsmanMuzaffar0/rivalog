import { put, call, takeEvery, take } from 'redux-saga/effects';
import { ACTIVATEDEACTIVEPREFFEREDROUTE_FAILED, ACTIVATEDEACTIVEPREFFEREDROUTE_REQUEST, ACTIVATEDEACTIVEPREFFEREDROUTE_SUCCESS } from '../actions/types';
import Api from '../../common/Api';

export function* ActiveDeactivePreRouteAsyn({ params }) {
  try {
    const response = yield call(Api.ActiveDeactivePreRoute, params);

    yield put({ type: ACTIVATEDEACTIVEPREFFEREDROUTE_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: ACTIVATEDEACTIVEPREFFEREDROUTE_FAILED, payload: e });
  }
}

export function* ActivateDeactivatePreRouteSaga() {
  yield takeEvery(ACTIVATEDEACTIVEPREFFEREDROUTE_REQUEST, ActiveDeactivePreRouteAsyn);
}
export default ActivateDeactivatePreRouteSaga;