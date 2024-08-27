import {
  EMAILLOGIN_REQUEST,
  GETLANG_REQUEST,
  GETCOMPANY_REQUEST,
  GETCOUNTRY_REQUEST,
  GETCITY_REQUEST,
  SIGNUP_REQUEST,
  GETUSERDETAIS_REQUEST,
  EDITUSERPROFILE_REQUEST,
  GETTRAILERTYPELIST_REQUEST,
  GETTRAILERFLOORTYPELIST_REQUEST,
  GETTRANSPORTTYPELIST_REQUEST,
  UPLOADTRAILERPLATEPIC_REQUEST,
  GETTRAILERLIST_REQUEST,
  GETTRAILERDETAILS_REQUEST,
  DELETETRAILER_REQUEST,
  GETTRAILERPLATEPICTURE_REQUEST,
  ADDTRAILER_REQUEST,
  EDITTRAILER_REQUEST,
  GETVEHICLETYPELIST_REQUEST,
  ADDVEHICLE_REQUEST,
  EDITVEHICLE_REQUEST,
  GETVEHICLELIST_REQUEST,
  UPLOADVEHICLEFILE_REQUEST,
  GETVEHICLEFILES_REQUEST,
  DELETEVEHICLE_REQUEST,
  ADDDRIVER_REQUEST,
  EDITDRIVER_REQUEST,
  GETDRIVERLIST_REQUEST,
  UPLOADDRIVERFILE_REQUEST,
  GETDRIVERFILES_REQUEST,
  DELETEDRIVER_REQUEST,
  GETFREIGHTLIST_REQUEST,
  GETTRANSPORTLIST_REQUEST,
  SAVEDEVICETOKEN_REQUEST,
  CREATETRANSPORTERGPSPOINT_REQUEST,
  CREATETRANSPORTAPPLICATION_REQUEST,
  DELETETRANSPORTAPPLICATION_REQUEST,
  ADDBANKACCOUNT_REQUEST,
  EDITBANKACCOUNT_REQUEST,
  DELETEBANKACCOUNT_REQUEST,
  GETBANKACCOUNTLIST_REQUEST,
  UPLOADUSERPROFILE_REQUEST,
  DASHBOARD_REQUEST,
  USERNAMELOGIN_REQUEST,
  MOBILELOGIN_REQUEST,
  SETASPRIMARY_REQUEST,
  ADDPREFFEREDROUTE_REQUEST,
  UPDATEPREFFEREDROUTE_REQUEST,
  DELETEPREFFEREDROUTE_REQUEST,
  GETPREFFEREDROUTE_REQUEST,
  ACTIVATEDEACTIVEPREFFEREDROUTE_REQUEST,
  CREATETRANSPORTER_REQUEST,
  UPDATETRANSPORTERSTATUS_REQUEST,
  NOTIFICATIONTOKEN_REQUEST,
  GETNOTIFICATIONLIST_REQUEST,
  GETADDRESS_REQUEST,
  SETNOTIFICATIONSTATEASREAD_REQUEST,
  GETREFRESHTOKEN_REQUEST,
  CHANGEPASSWORD_REQUEST,
  UPDATELANG_REQUEST,
  GETFREIGHTSTATUS_REQUEST,
  GETMYFREIGHT_REQUEST,
  GETINVOICEADDRESSES_REQUEST,
  ADD_NEW_INVOICE_ADDRESS_REQUEST,
  SET_PRIMARY_INVOICE_ADDRESS_REQUEST,
  HOME_PAGE_REQUEST,
  GETUSERLIST_REQUEST,
  CREATEUSERLIST_REQUEST,
  DELETEUSERLIST_REQUEST,
  UPDATE_INVOICE_ADDRESS_REQUEST,
  GETCURRENTCOMPANYINFO_REQUEST,
  UPDATECURRENTCOMPANYINFO_REQUEST,
  GET_FREIGHT_TYPES_REQUEST,
  GET_TRANSPORT_TYPES_REQUEST,
  GET_FREIGHT_CONTENT_TYPE_LIST_REQUEST,
  GET_PACKAGING_TYPE_REQUEST,
  GET_LOADING_TYPE_REQUEST,
  GET_GTIP_LIST_REQUEST,
  CREATE_FREIGHT_REQUEST,
  GET_FREIGHT_LOCATIONS_REQUEST,
  GETTRAILERSPECIFICATIONTYPELIST_REQUEST,
  GET_CURRENCY_LIST_REQUEST,
  GET_CONTAINER_PROPOSAL_LIST_REQUEST,
  GET_CONTAINER_PROPOSAL_REQUEST,
  GET_SELCTED_CONTAINER_PROPOSAL_REQUEST,
  GET_FREIGHT_IN_CONTAINER_REQUEST,
  GET_SUB_CONTRACT_LIST_REQUEST,
  GET_MAIN_CONTRACT_COMPANY_LIST_REQUEST,
  GETFREIGHTSIGNEDLIST_REQUEST,
} from "./types";

export const Action = (params) => {
  console.log("EMAIL ACTION CALLED");
  return {
    type: EMAILLOGIN_REQUEST,
    params,
  };
};
export const UsernameAction = (params) => {
  console.log("USERNAME ACTION CALLED");
  return {
    type: USERNAMELOGIN_REQUEST,
    params,
  };
};
export const MobileAction = (params) => {
  console.log("MOBILE ACTION CALLED");

  return {
    type: MOBILELOGIN_REQUEST,
    params,
  };
};

export const SignUpAction = (params) => {
  return {
    type: SIGNUP_REQUEST,
    params,
  };
};
export const ChangePasswordAction = (params) => {
  return {
    type: CHANGEPASSWORD_REQUEST,
    params,
  };
};

export const LanguageAction = (params) => {
  return {
    type: GETLANG_REQUEST,
    params,
  };
};

export const UpdateLanguageAction = (params) => {
  return {
    type: UPDATELANG_REQUEST,
    params,
  };
};

export const GetCompanyAction = (params) => {
  return {
    type: GETCOMPANY_REQUEST,
    params,
  };
};

export const GetCountryAction = (params) => {
  return {
    type: GETCOUNTRY_REQUEST,
    params,
  };
};

export const GetCityAction = (params) => {
  return {
    type: GETCITY_REQUEST,
    params,
  };
};

export const GetUserDetailsAction = (params) => {
  return {
    type: GETUSERDETAIS_REQUEST,
  };
};

export const EditUserProfileAction = (params) => {
  return {
    type: EDITUSERPROFILE_REQUEST,
    params,
  };
};

export const UploadUserProfileAction = (params) => {
  return {
    type: UPLOADUSERPROFILE_REQUEST,
    params,
  };
};

export const GetUsersListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETUSERLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const CreateUserListAction = (params) => {
  return {
    type: CREATEUSERLIST_REQUEST,
    params,
  };
};
export const DeleteUserListAction = (params) => {
  console.log("Params", params);
  return {
    type: DELETEUSERLIST_REQUEST,
    params,
  };
};

export const GetTrailerDetailsAction = (TrailerID) => {
  return {
    type: GETTRAILERDETAILS_REQUEST,
    TrailerID,
  };
};

export const AddTrailerAction = (params) => {
  return {
    type: ADDTRAILER_REQUEST,
    params,
  };
};

export const EditTrailerAction = (params) => {
  return {
    type: EDITTRAILER_REQUEST,
    params,
  };
};

export const DeleteTrailerAction = (TrailerID) => {
  return {
    type: DELETETRAILER_REQUEST,
    TrailerID,
  };
};

export const GetTrailerTypeListAction = (
  SearchText,
  PageIndex,
  PageCount,
  TransportTypeId
) => {
  return {
    type: GETTRAILERTYPELIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
    TransportTypeId,
  };
};

export const GetTrailerFloorTypeListAction = (
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GETTRAILERFLOORTYPELIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetTrailerSpecificationListAction = (
  TrailerTypeId,
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GETTRAILERSPECIFICATIONTYPELIST_REQUEST,
    TrailerTypeId,
    SearchText,
    PageIndex,
    PageCount,
  };
};

// export const GetTransportTypeListAction = (
//   TransportTypeId,
//   SearchText,
//   PageIndex,
//   PageCount
// ) => {
//   return {
//     type: GETTRANSPORTTYPELIST_REQUEST,
//     TransportTypeId,
//     SearchText,
//     PageIndex,
//     PageCount,
//   };
// };

// export const GetTransportSpecificationListAction = (
//   TransportTypeId,
//   SearchText,
//   PageIndex,
//   PageCount
// ) => {
//   return {
//     type: GETTRANSPORTSPECIFICATIONTYPELIST_REQUEST,
//     TransportTypeId,
//     SearchText,
//     PageIndex,
//     PageCount,
//   };
// };

export const GetTrailerListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETTRAILERLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const UploadTrailerPlatePicAction = (TrailerId, params) => {
  return {
    type: UPLOADTRAILERPLATEPIC_REQUEST,
    TrailerId,
    params,
  };
};

export const GetTrailerPlatePictureAction = (TrailerID) => {
  return {
    type: GETTRAILERPLATEPICTURE_REQUEST,
    TrailerID,
  };
};

export const GetVehicleTypeListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETVEHICLETYPELIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const AddVehicleAction = (params) => {
  return {
    type: ADDVEHICLE_REQUEST,
    params,
  };
};

export const EditVehicleAction = (params) => {
  return {
    type: EDITVEHICLE_REQUEST,
    params,
  };
};

export const GetVehicleListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETVEHICLELIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const UploadVehicleFileAction = (VehicleId, FileTypeName, params) => {
  return {
    type: UPLOADVEHICLEFILE_REQUEST,
    VehicleId,
    FileTypeName,
    params,
  };
};

export const GetVehicleFilesAction = (VehicleID) => {
  return {
    type: GETVEHICLEFILES_REQUEST,
    VehicleID,
  };
};

export const DeleteVehicleAction = (VehicleID) => {
  return {
    type: DELETEVEHICLE_REQUEST,
    VehicleID,
  };
};
/////////////

export const AddDriverAction = (params) => {
  return {
    type: ADDDRIVER_REQUEST,
    params,
  };
};

export const EditDriverAction = (params) => {
  return {
    type: EDITDRIVER_REQUEST,
    params,
  };
};

export const GetDriverListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETDRIVERLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const UploadDriverFileAction = (DriverId, FileTypeName, params) => {
  return {
    type: UPLOADDRIVERFILE_REQUEST,
    DriverId,
    FileTypeName,
    params,
  };
};

export const GetDriverFilesAction = (DriverID) => {
  return {
    type: GETDRIVERFILES_REQUEST,
    DriverID,
  };
};

export const DeleteDriverAction = (DriverID) => {
  return {
    type: DELETEDRIVER_REQUEST,
    DriverID,
  };
};

export const GetFreightListAction = (
  SearchText,
  PageIndex,
  PageCount,
  FilterOptions
) => {
  return {
    type: GETFREIGHTLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
    FilterOptions,
  };
};

export const GetFreightStatusAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETFREIGHTSTATUS_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetMyFreightAction = (
  SearchText,
  PageIndex,
  PageCount,
  freightStatusId = "",
  companyId = ""
) => {
  return {
    type: GETMYFREIGHT_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
    freightStatusId,
    companyId,
  };
};

export const GetInvoiceAddressesAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETINVOICEADDRESSES_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const AddNewInvoiceAddress = (params) => {
  return {
    type: ADD_NEW_INVOICE_ADDRESS_REQUEST,
    params,
  };
};

export const UpdateInvoiceAddress = (params) => {
  return {
    type: UPDATE_INVOICE_ADDRESS_REQUEST,
    params,
  };
};

export const SetPrimaryInvoiceAddress = (params) => {
  return {
    type: SET_PRIMARY_INVOICE_ADDRESS_REQUEST,
    params,
  };
};

export const GetTransportListAction = (params) => {
  return {
    type: GETTRANSPORTLIST_REQUEST,
    params,
  };
};

export const GetCurrentCompanyInfoAction = (params) => {
  return {
    type: GETCURRENTCOMPANYINFO_REQUEST,
    params,
  };
};

export const UpdateCurrentCompanyInfoAction = (params) => {
  return {
    type: UPDATECURRENTCOMPANYINFO_REQUEST,
    params,
  };
};

export const SaveDeviceTokenAction = (params) => {
  return {
    type: SAVEDEVICETOKEN_REQUEST,
    params,
  };
};

export const CreateTransporterGPSPointAction = (params) => {
  return {
    type: CREATETRANSPORTERGPSPOINT_REQUEST,
    params,
  };
};

export const CreateTransportApplicationAction = (params) => {
  return {
    type: CREATETRANSPORTAPPLICATION_REQUEST,
    params,
  };
};

export const DeleteTransportApplicationAction = (params) => {
  return {
    type: DELETETRANSPORTAPPLICATION_REQUEST,
    params,
  };
};

export const AddBankAccountAction = (params) => {
  return {
    type: ADDBANKACCOUNT_REQUEST,
    params,
  };
};

export const EditBankAccountAction = (params) => {
  return {
    type: EDITBANKACCOUNT_REQUEST,
    params,
  };
};

export const DeleteBankAccountAction = (BankAccountID) => {
  return {
    type: DELETEBANKACCOUNT_REQUEST,
    BankAccountID,
  };
};

export const GetBankAccountListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETBANKACCOUNTLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetDashboardAction = (params) => {
  return {
    type: DASHBOARD_REQUEST,
    params,
  };
};

export const GetHomePageAction = (params) => {
  return {
    type: HOME_PAGE_REQUEST,
    params,
  };
};

export const SetAsPrimaryAction = (params) => {
  return {
    type: SETASPRIMARY_REQUEST,
    params,
  };
};

export const AddPrefferedRouteAction = (params) => {
  return {
    type: ADDPREFFEREDROUTE_REQUEST,
    params,
  };
};

export const UpdatePrefferedRouteAction = (params) => {
  return {
    type: UPDATEPREFFEREDROUTE_REQUEST,
    params,
  };
};

export const DeletePrefferedRouteAction = (params) => {
  return {
    type: DELETEPREFFEREDROUTE_REQUEST,
    params,
  };
};

export const GetPrefferedRouteAction = (params) => {
  return {
    type: GETPREFFEREDROUTE_REQUEST,
    params,
  };
};

export const ActivateDeactivatePreferredRouteAction = (params) => {
  return {
    type: ACTIVATEDEACTIVEPREFFEREDROUTE_REQUEST,
    params,
  };
};

export const CreateTransporterAction = (params) => {
  return {
    type: CREATETRANSPORTER_REQUEST,
    params,
  };
};

export const UpdateTransporterStatusAction = (params) => {
  return {
    type: UPDATETRANSPORTERSTATUS_REQUEST,
    params,
  };
};

export const SetNotificationToken = (params) => {
  return {
    type: NOTIFICATIONTOKEN_REQUEST,
    params,
  };
};

export const GetNotificationList = (params) => {
  return {
    type: GETNOTIFICATIONLIST_REQUEST,
    params,
  };
};

export const SetNotificationStateAsReadAction = (params) => {
  return {
    type: SETNOTIFICATIONSTATEASREAD_REQUEST,
    params,
  };
};

export const GetAddressList = (SearchText, PageIndex, PageCount) => {
  return {
    type: GETADDRESS_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetRefreshTokenAction = (params) => {
  console.log("Refreshtoken params", params);
  return {
    type: GETREFRESHTOKEN_REQUEST,
    params,
  };
};

// TRANSPORT APIS

export const GetTransportTypeList = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_TRANSPORT_TYPES_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

// FREIGHT APIS
export const GetFreightTypeList = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_FREIGHT_TYPES_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetCurrencyListAction = () => {
  return {
    type: GET_CURRENCY_LIST_REQUEST,
  };
};

export const GetFreightContentTypeListAction = (
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GET_FREIGHT_CONTENT_TYPE_LIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetPackagingTypeAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_PACKAGING_TYPE_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetLoadingTypeAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_LOADING_TYPE_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetFreightInContainerAction = (containerId) => {
  return {
    type: GET_FREIGHT_IN_CONTAINER_REQUEST,
    containerId,
  };
};

export const GetGtipListAction = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_GTIP_LIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const CreateFreightAction = (params) => {
  return {
    type: CREATE_FREIGHT_REQUEST,
    params,
  };
};

export const GetFreightLocationsAction = (PageIndex, PageCount) => {
  return {
    type: GET_FREIGHT_LOCATIONS_REQUEST,
    PageIndex,
    PageCount,
  };
};
export const GetContainerProposalList = (SearchText, PageIndex, PageCount) => {
  return {
    type: GET_CONTAINER_PROPOSAL_LIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};
export const GetSelectedContainerProposalAction = (containerId) => {
  return {
    type: GET_SELCTED_CONTAINER_PROPOSAL_REQUEST,
    containerId,
  };
};

export const GetContainerProposalAction = (
  containerId,
  PageIndex,
  PageCount
) => {
  return {
    type: GET_CONTAINER_PROPOSAL_REQUEST,
    containerId,
    PageIndex,
    PageCount,
  };
};

export const GetMainContractorListAction = (
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GET_MAIN_CONTRACT_COMPANY_LIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetFreightSignedListAction = (
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GETFREIGHTSIGNEDLIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};

export const GetSubContractorListAction = (
  SearchText,
  PageIndex,
  PageCount
) => {
  return {
    type: GET_SUB_CONTRACT_LIST_REQUEST,
    SearchText,
    PageIndex,
    PageCount,
  };
};
export function resetRedux() {
  return { type: "RESET_ACTION" };
}
