import {
    GET_TRANSPORT_TYPES_SUCCESS,
    GET_TRANSPORT_TYPES_FAILED,
  } from "../actions/types";
  const INITIAL_STATE = {
    loader: true,
    data: [],
    GetTransportTypes: false,
  };
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case GET_TRANSPORT_TYPES_SUCCESS:
        return {
          GetTransportTypes: true,
          data: action.payload,
          loader: false,
        };
  
      case GET_TRANSPORT_TYPES_FAILED:
        return {
          GetTransportTypes: false,
          error: action.payload,
          loader: false,
        };
  
      default:
        return state;
    }
  };
  