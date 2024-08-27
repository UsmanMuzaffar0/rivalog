import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import GetLanguage from "./GetLanguageReducer";
import GetCompanyReducer from "./GetCompanyReducer";
import GetCountryReducer from "./GetCountryReducer";
import SignUpReducer from "./SignUpReducer";
import GetUserDetailsReducer from "./GetUserDetailsReducer";
import EditUserProfileReducer from "./EditUserProfileReducer";
import GetTrailerDetailsReducer from "./GetTrailerDetailsReducer";
import AddTrailerReducer from "./AddTrailerReducer";
import EditTrailerReducer from "./EditTrailerReducer";
import GetTrailerTypeListReducer from "./GetTrailerTypeListReducer";
import GetTransportTypeList from "./GetTransportTypeList";
import GetTrailerFloorTypeListReducer from "./GetTrailerFloorTypeListReducer";
import GetTrailerSpecificationListReducer from "./GetTrailerSpecificationListReducer";
import UploadTrailerPlatePicReducer from "./UploadTrailerPlatePicReducer";
import GetTrailerListReducer from "./GetTrailerListReducer";
import DeleteTrailerReducer from "./DeleteTrailerReducer";
import GetTrailerPlatePictureReducer from "./GetTrailerPlatePictureReducer";

import GetVehicleTypeListReducer from "./GetVehicleTypeListReducer";
import AddVehicleReducer from "./AddVehicleReducer";
import EditVehicleReducer from "./EditVehicleReducer";
import GetVehicleListReducer from "./GetVehicleListReducer";
import UploadVehicleFileReducer from "./UploadVehicleFileReducer";
import GetVehicleFilesReducer from "./GetVehicleFilesReducer";
import DeleteVehicleReducer from "./DeleteVehicleReducer";

import AddDriverReducer from "./AddDriverReducer";
import EditDriverReducer from "./EditDriverReducer";
import GetDriverListReducer from "./GetDriverListReducer";
import UploadDriverFileReducer from "./UploadDriverFileReducer";
import GetDriverFilesReducer from "./GetDriverFilesReducer";
import DeleteDriverReducer from "./DeleteDriverReducer";
import GetFreightListReducer from "./GetFreightListReducer";
import GetFreightSignedListReducer from "./GetFreightSignedListReducer";
import GetFreightStatusReducer from "./GetFreightStatusReducer";
import GetMyFreightReducer from "./GetMyFreightReducer";
import GetTransportListReducer from "./GetTransportListReducer";
import SavedDeviceTokenReducer from "./SaveDeviceTokenReducer";
import SetNotificationStateAsReadReducer from "./SetNotificationStateAsReadReducer";
import GetNotificationListReducer from "./GetNotificationListReducer";
import CreateTransporterGPSPointReducer from "./CreateTransporterGPSPointReducer";
import CreateTransportApplicationReducer from "./CreateTransportApplicationReducer";
import DeleteTransportApplicationReducer from "./DeleteTransportApplicationReducer";

import AddBankAccountReducer from "./AddBankAccountReducer";
import EditBankAccountReducer from "./EditBankAccountReducer";
import DeleteBankAccountReducer from "./DeleteBankAccountReducer";
import GetBankAccountListReducer from "./GetBankAccountListReducer";
import GetDashboardReducer from "./GetDashboardReducer";

import UploadUserProfileReducer from "./UploadUserProfileReducer";
import UsernameLoginReducer from "./UsernameLoginReducer";
import MobileLoginReducer from "./MobileLoginReducer";
import SetAsPrimaryReducer from "./SetAsPrimaryReducer";
import GetCityReducer from "./GetCityReducer";

import AddPrefferedRouteReducer from "./AddPrefferedRouteReducer";
import UpdatePrefferedRouteReducer from "./UpdatePrefferedRouteReducer";
import DeletePrefferedRouteReducer from "./DeletePrefferedRouteReducer";
import GetPrefferedRouteReducer from "./GetPrefferedRouteReducer";
import ActiveDeactivePreRouteReducer from "./ActiveDeactivePreRouteReducer";
import CreateTransporterReducer from "./CreateTransporterReducer";
import UpdateTransporterStatusReducer from "./UpdateTransporterStatusReducer";
import AddNotificationTokenReducer from "./AddNotificationTokenReducer";
import GetAddressListReducer from "./GetAddressListReducer";
import GetRefreshTokenReducer from "./GetRefreshTokenReducer";
import ChangePasswordReducer from "./ChangePasswordReducer";
import UpdateLanguageReducer from "./UpdateLanguageReducer";
import GetInvoiceAddressesReducer from "./GetInvoiceAddressesReducer";
import AddNewInvoiceAddressReducer from "./AddNewInvoiceAddressReducer";
import SetPrimaryInvoiceAddressReducer from "./SetPrimaryInvoiceAddressReducer";
import GetHomePageReducer from "./GetHomePageReducer";
import GetUsersListReducer from "./GetUsersListReducer";
import CreateNewUserReducer from "./CreateNewUserReducer";
import DeleteUserReducer from "./DeleteUserReducer";
import UpdateInvoiceAddressReducer from "./UpdateInvoiceAddressReducer";
import GetCurrentCompanyInfoReducer from "./GetCurrentCompanyInfoReducer";
import UpdateCurrentCompanyInfoReducer from "./UpdateCurrentCompanyInfoReducer";
import GetFreightTypeListReducer from "./GetFreightTypeList";
import GetCurrencyListReducer from "./GetCurrencyListReducer";
import GetFreightContentTypeListReducer from "./GetFreightContentTypeListReducer";
import GetPackagingTypeReducer from "./GetPackagingTypeReducer";
import GetLoadingTypeReducer from "./GetLoadingTypeReducer";
import GetGtipListReducer from "./GetGtipListReducer";
import CreateFreightReducer from "./CreateFreightReducer";
import GetFreightLocationsReducer from "./GetFreightLocationsReducer";
import GetContainerProposalListReducer from "./GetContainerProposalListReducer";
import GetContainerProposalReducer from "./GetContainerProposalReducer";
import GetSelectedContainerProposalReducer from "./GetSelectedContainerProposalReducer";
import GetFreightInContainerReducer from "./GetFreightInContainerReducer";
import GetMainContractCompanyListReducer from "./GetMainContractCompanyListReducer";
import GetSubContractListReducer from "./GetSubContractListReducer";

const rootReducer = (state, action) => {
  if (action.type === "RESET_ACTION") {
    return appReducers(undefined, action); // Reseting Redux Store ( LogOut )
  }

  return appReducers(state, action);
};

const appReducers = combineReducers({
  Login: LoginReducer,
  UsernameLogin: UsernameLoginReducer,
  MobileLogin: MobileLoginReducer,
  Language: GetLanguage,
  UpdateLang: UpdateLanguageReducer,
  CompanyData: GetCompanyReducer,
  CountryData: GetCountryReducer,
  SignUp: SignUpReducer,
  UserData: GetUserDetailsReducer,
  EditProfileData: EditUserProfileReducer,
  UploadUserProfileData: UploadUserProfileReducer,

  TrailerData: GetTrailerDetailsReducer,
  AddTrailerData: AddTrailerReducer,
  EditTrailerData: EditTrailerReducer,
  TrailerTypeList: GetTrailerTypeListReducer,
  TransportTypeList: GetTransportTypeList,
  TrailerFloorTypeList: GetTrailerFloorTypeListReducer,
  TrailerSpecificationList: GetTrailerSpecificationListReducer,
  UploadTrailerPlatePicData: UploadTrailerPlatePicReducer,
  TrailerList: GetTrailerListReducer,
  DeleteTrailer: DeleteTrailerReducer,
  TrailerPlatePic: GetTrailerPlatePictureReducer,

  VehicleTypeList: GetVehicleTypeListReducer,
  AddVehicleData: AddVehicleReducer,
  EditVehicleData: EditVehicleReducer,
  VehicleList: GetVehicleListReducer,
  UploadVehicleFileData: UploadVehicleFileReducer,
  VehicleFilesData: GetVehicleFilesReducer,
  DeleteVehicle: DeleteVehicleReducer,

  AddDriverData: AddDriverReducer,
  EditDriverData: EditDriverReducer,
  DriverList: GetDriverListReducer,
  UploadDriverFileData: UploadDriverFileReducer,
  DriverFilesData: GetDriverFilesReducer,
  DeleteDriver: DeleteDriverReducer,

  FreightList: GetFreightListReducer,
  FreightSignedList: GetFreightSignedListReducer,
  FreightStatus: GetFreightStatusReducer,
  MyFreight: GetMyFreightReducer,
  InvoiceAddresses: GetInvoiceAddressesReducer,
  AddNewInvoiceAddress: AddNewInvoiceAddressReducer,
  UpdateInvoiceAddress: UpdateInvoiceAddressReducer,
  TransportList: GetTransportListReducer,
  SetPrimaryIvoiceAddress: SetPrimaryInvoiceAddressReducer,
  SavedDeviceTokenList: SavedDeviceTokenReducer,

  GetCurrentCompanyInfo: GetCurrentCompanyInfoReducer,
  UpdateCurrentCompanyInfo: UpdateCurrentCompanyInfoReducer,

  NotificationList: GetNotificationListReducer,
  NotificationState: SetNotificationStateAsReadReducer,
  CreateTransporterGPSPoint: CreateTransporterGPSPointReducer,

  CreateTransportApplication: CreateTransportApplicationReducer,
  DeleteTransportApplication: DeleteTransportApplicationReducer,

  AddBankAccountData: AddBankAccountReducer,
  EditBankAccountData: EditBankAccountReducer,
  DeleteBankAccount: DeleteBankAccountReducer,
  BankAccountList: GetBankAccountListReducer,
  Dashboard: GetDashboardReducer,
  HomePage: GetHomePageReducer,
  SetAsPrimary: SetAsPrimaryReducer,
  CityData: GetCityReducer,

  UsersList: GetUsersListReducer,
  CreateNewUser: CreateNewUserReducer,
  DeleteUser: DeleteUserReducer,

  AddPrefferedRouteData: AddPrefferedRouteReducer,
  UpdatePrefferedRouteData: UpdatePrefferedRouteReducer,
  DeletePrefferedRouteData: DeletePrefferedRouteReducer,
  GetPrefferedRouteData: GetPrefferedRouteReducer,
  ActiveDeactivePreRouteData: ActiveDeactivePreRouteReducer,
  CreateTransporterData: CreateTransporterReducer,
  UpdateTransporterStatusData: UpdateTransporterStatusReducer,
  AddNotificationTokenData: AddNotificationTokenReducer,
  GetAddressData: GetAddressListReducer,

  GetRefreshToken: GetRefreshTokenReducer,
  ChangePassword: ChangePasswordReducer,

  // Freight
  FreightTypeList: GetFreightTypeListReducer,
  GetCurrencyList: GetCurrencyListReducer,
  GetFreightContentTypeList: GetFreightContentTypeListReducer,
  GetPackagingType: GetPackagingTypeReducer,
  GetLoadingType: GetLoadingTypeReducer,
  GetGtipList: GetGtipListReducer,
  CreateFreight: CreateFreightReducer,
  GetFreightLocations: GetFreightLocationsReducer,
  GetContainerProposalList: GetContainerProposalListReducer,
  GetContainerProposal: GetContainerProposalReducer,
  GetSelectedContainerProposal: GetSelectedContainerProposalReducer,
  GetFreightInContainer: GetFreightInContainerReducer,
  GetMainContractCompanyList: GetMainContractCompanyListReducer,
  GetSubContractList: GetSubContractListReducer,
});

export default rootReducer;
