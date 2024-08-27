import { put, call, takeEvery, take, all } from "redux-saga/effects";

import LoginSaga from "./LoginSaga";
import GetLangSaga from "./GetLangsaga";
import GetCompanySaga from "./GetCompanysaga";
import GetCountrySaga from "./GetCountrysaga";
import SignUpSaga from "./SignUpSaga";
import GetUserDetailsSaga from "./GetUserDetailsSaga";
import { EditUserProfileSaga } from "./EditUserProfileSaga";
import { GetTrailerDetailsSaga } from "./GetTrailerDetailsSaga";
import { AddTrailerSaga } from "./AddTrailerSaga";
import { EditTrailerSaga } from "./EditTrailerSaga";
import { GetTrailerTypeListSaga } from "./GetTrailerTypeListSaga";
import { GetTrailerFloorTypeListSaga } from "./GetTrailerFloorTypeListSaga";
import { GetTrailerSpecificationListSaga } from "./GetTrailerSpecificationListSaga";
import { UploadTrailerPlatePicSaga } from "./UploadTrailerPlatePicSaga";
import { GetTrailerListSaga } from "./GetTrailerListSaga";
import { DeleteTrailerSaga } from "./DeleteTrailerSaga";
import { GetTrailerPlatePictureSaga } from "./GetTrailerPlatePictureSaga";
import { GetVehicleTypeListSaga } from "./GetVehicleTypeListSaga";
import { AddVehicleSaga } from "./AddVehicleSaga";
import { EditVehicleSaga } from "./EditVehicleSaga";
import { DeleteVehicleSaga } from "./DeleteVehicleSaga";
import { GetVehicleListSaga } from "./GetVehicleListSaga";
import { UploadVehicleFileSaga } from "./UploadVehicleFileSaga";
import { GetVehicleFilesSaga } from "./GetVehicleFilesSaga";

import { AddDriverSaga } from "./AddDriverSaga";
import { EditDriverSaga } from "./EditDriverSaga";
import { DeleteDriverSaga } from "./DeleteDriverSaga";
import { GetDriverListSaga } from "./GetDriverListSaga";
import { UploadDriverFileSaga } from "./UploadDriverFileSaga";
import { GetDriverFilesSaga } from "./GetDriverFilesSaga";
import { GetFreightListSaga } from "./GetFreightListSaga";
import { GetTransportListSaga } from "./GetTransportListSaga";
import { GetTransportTypeListSaga } from "./GetTransportTypesSaga";
import { SaveDeviceTokenSaga } from "./SaveDeviceTokenSaga";
import { SetNotificationStateAsReadAsynSaga } from "./SetNotificationStateAsReadSaga";
import { GetNotificationListSaga } from "./GetNotificationListSaga";
import { CreateTransporterGPSPointSaga } from "./CreateTransporterGPSPointSaga";
import { CreateTransportApplicationSaga } from "./CreateTransportApplicationSaga";
import { DeleteTransportApplicationSaga } from "./DeleteTransportApplicationSaga";

import { AddBankAccountSaga } from "./AddBankAccountSaga";
import { EditBankAccountSaga } from "./EditBankAccountSaga";
import { DeleteBankAccountSaga } from "./DeleteBankAccountSaga";
import { GetBankAccountListSaga } from "./GetBankAccountListSaga";
import { UploadUserProfileSaga } from "./UploadUserProfileSaga";

import { GetDashboardSaga } from "./GetDashboardSaga";
import UsernameLoginSaga from "./UsernameLoginSaga";
import MobileLoginSaga from "./MobileLoginSaga";
import SetAsPrimarySaga from "./SetAsPrimarySaga";
import GetCitySaga from "./GetCitySaga";

import AddPrefferedRouteSaga from "./AddPrefferedRouteSaga";
import UpdatePrefferedRouteSaga from "./UpdatePrefferedRouteSaga";
import DeletePrefferedRouteSaga from "./DeletePrefferedRouteSaga";
import GetPrefferedRouteSaga from "./GetPrefferedRouteSaga";
import ActivateDeactivatePreRouteSaga from "./ActivateDeactivatePreRouteSaga";
import CreateTransporterSaga from "./CreateTransporterSaga";
import UpdateTransporterStatusSaga from "./UpdateTransporterStatusSaga";
import AddNotificationTokenSaga from "./AddNotificationTokenSaga";
import GetAddressListSaga from "./GetAddressListSaga";
import GetRefreshTokenSaga from "./GetRefreshTokenSaga";
import ChnagePasswordSaga from "./ChangePasswordSaga";
import UpdateLanguageSaga from "./UpdateLanguageSaga";
import GetFreightStatusSaga from "./GetFreightStatusSaga";
import GetMyFreightSaga from "./GetMyFreightSaga";
import GetInvoiceAddressesSaga from "./GetInvoiceAddressesSaga";
import AddNewInvoiceAddressSaga from "./AddNewInvoiceAddressSaga";
import SetPrimaryInvoiceAddressSaga from "./SetPrimaryInvoiceAddressSaga";
import GetHomePageSaga from "./GetHomePageSaga";
import GetUserListSaga from "./GetUsersListSaga";
import CreateNewUserSaga from "./CreateNewUserSaga";
import DeleteUserSaga from "./DeleteUserSaga";
import UpdateInvoiceAddressSaga from "./UpdateInvoiceAddressSaga";
import GetCurrentCompanyInfoSaga from "./GetCurrentCompanyInfoSaga";
import UpdateCurrentCompanyInfoSaga from "./UpdateCurrentCompanyInfoSaga";
import { GetFreightTypeListSaga } from "./GetFreightTypesSaga";
import GetFreightContentTypeListSaga from "./GetFreightContentTypeListSaga";
import GetPackagingTypeSaga from "./GetPackagingTypeSaga";
import GetLoadingTypeSaga from "./GetLoadingTypeSaga";
import GetGtipListSaga from "./GetGtipListSaga";
import GetFreightLocationsSaga from "./GetFreightLocationsSaga";
import GetCurrencyListSaga from "./GetCurrencyListSaga";
import GetContainerProposalListSaga from "./GetContainerProposalListSaga";
import GetContainerProposalSaga from "./GetContainerProposalSaga";
import GetSelectedContainerProposalSaga from "./GetSelectedContainerProposalSaga";
import GetFreightInContainerSaga from "./GetFreightInContainerSaga";
import GetMainContractCompanyListSaga from "./GetMainContractCompanyListSaga";
import GetSubContractListSaga from "./GetSubContractListSaga";
import GetFreightSignedListSaga from "./GetFreightSignedListSaga";

export default function* rootSaga() {
  yield all([
    LoginSaga(),
    GetLangSaga(),
    UpdateLanguageSaga(),
    GetCompanySaga(),
    GetCountrySaga(),
    SignUpSaga(),
    GetUserDetailsSaga(),
    EditUserProfileSaga(),
    UploadUserProfileSaga(),
    GetTrailerDetailsSaga(),
    AddTrailerSaga(),
    EditTrailerSaga(),
    GetTrailerTypeListSaga(),
    GetTrailerFloorTypeListSaga(),
    GetTrailerSpecificationListSaga(),
    UploadTrailerPlatePicSaga(),
    GetVehicleTypeListSaga(),
    AddVehicleSaga(),
    GetTrailerListSaga(),
    DeleteTrailerSaga(),
    GetTrailerPlatePictureSaga(),
    GetVehicleListSaga(),
    UploadVehicleFileSaga(),
    GetVehicleFilesSaga(),
    EditVehicleSaga(),
    DeleteVehicleSaga(),
    AddDriverSaga(),
    EditDriverSaga(),
    DeleteDriverSaga(),
    GetDriverListSaga(),
    UploadDriverFileSaga(),
    GetDriverFilesSaga(),
    GetFreightListSaga(),
    GetFreightSignedListSaga(),
    GetTransportListSaga(),
    GetTransportTypeListSaga(),
    SaveDeviceTokenSaga(),
    GetNotificationListSaga(),
    SetNotificationStateAsReadAsynSaga(),
    CreateTransporterGPSPointSaga(),
    CreateTransportApplicationSaga(),
    DeleteTransportApplicationSaga(),
    AddBankAccountSaga(),
    EditBankAccountSaga(),
    DeleteBankAccountSaga(),
    GetBankAccountListSaga(),
    GetDashboardSaga(),
    UsernameLoginSaga(),
    MobileLoginSaga(),
    SetAsPrimarySaga(),
    GetCitySaga(),
    AddPrefferedRouteSaga(),
    UpdatePrefferedRouteSaga(),
    DeletePrefferedRouteSaga(),
    GetPrefferedRouteSaga(),
    GetFreightStatusSaga(),
    GetMyFreightSaga(),
    GetInvoiceAddressesSaga(),
    ActivateDeactivatePreRouteSaga(),
    CreateTransporterSaga(),
    UpdateTransporterStatusSaga(),
    AddNotificationTokenSaga(),
    GetAddressListSaga(),
    GetRefreshTokenSaga(),
    ChnagePasswordSaga(),
    AddNewInvoiceAddressSaga(),
    SetPrimaryInvoiceAddressSaga(),
    GetHomePageSaga(),
    GetUserListSaga(),
    CreateNewUserSaga(),
    DeleteUserSaga(),
    UpdateInvoiceAddressSaga(),
    GetCurrentCompanyInfoSaga(),
    UpdateCurrentCompanyInfoSaga(),
    GetMainContractCompanyListSaga(),
    GetSubContractListSaga(),
    // Freight
    GetFreightTypeListSaga(),
    GetFreightContentTypeListSaga(),
    GetPackagingTypeSaga(),
    GetLoadingTypeSaga(),
    GetGtipListSaga(),
    GetFreightLocationsSaga(),
    GetCurrencyListSaga(),
    GetContainerProposalListSaga(),
    GetContainerProposalSaga(),
    GetSelectedContainerProposalSaga(),
    GetFreightInContainerSaga(),
  ]);
}
