import AsyncStorage from "@react-native-async-storage/async-storage";
import NetChecker from "../common/Component/Network";

export const url = "https://www.rivalogservice.com/api/"; // Prod
//export const url = "https://rivalogservicetest.com/api/"; // Test

module.exports = {
  url: url,
  async Login(params) {
    return await fetch(`${url}user-management/users/signin/byemail`, {
      method: "POST",
      headers: {
        Cookie:
          "token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1bmlrd29ya3N5c3RlbXNAZ21haWwuY29tIiwiaWF0IjoxNjUzNTM4NjE4LCJleHAiOjE2NTQxNDM0MTgsInVzZXJJZCI6NCwibmFtZSI6ImFiY3NlZmdtZG1kZCIsInN1cm5hbWUiOiJueHNteG14ICIsImNvbXBhbnlJZCI6NCwiY29tcGFueU5hbWUiOiJVbmlrIiwiY291bnRyeSI6IklOIiwibGFuZ3VhZ2UiOiJlbiIsImltYWdlIjoiNTZlYjc3MmYtMzNlNC00ODA1LTgyNzEtMWRmNjk3Njk3MDMwIn0.4dY8-8nr-BqQMrVr9lseavN2ZrcLNEEWBnXN-T8z_VA",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async UsernameLogin(params) {
    return await fetch(`${url}user-management/users/signin/byusername`, {
      method: "POST",
      headers: {
        Cookie:
          "token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1bmlrd29ya3N5c3RlbXNAZ21haWwuY29tIiwiaWF0IjoxNjUzNTM4NjE4LCJleHAiOjE2NTQxNDM0MTgsInVzZXJJZCI6NCwibmFtZSI6ImFiY3NlZmdtZG1kZCIsInN1cm5hbWUiOiJueHNteG14ICIsImNvbXBhbnlJZCI6NCwiY29tcGFueU5hbWUiOiJVbmlrIiwiY291bnRyeSI6IklOIiwibGFuZ3VhZ2UiOiJlbiIsImltYWdlIjoiNTZlYjc3MmYtMzNlNC00ODA1LTgyNzEtMWRmNjk3Njk3MDMwIn0.4dY8-8nr-BqQMrVr9lseavN2ZrcLNEEWBnXN-T8z_VA",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      return [response.json(), response.status];
    });
  },
  async MobileLogin(params) {
    return await fetch(`${url}user-management/users/signin/bymobile`, {
      method: "POST",
      headers: {
        Cookie:
          "token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1bmlrd29ya3N5c3RlbXNAZ21haWwuY29tIiwiaWF0IjoxNjUzNTM4NjE4LCJleHAiOjE2NTQxNDM0MTgsInVzZXJJZCI6NCwibmFtZSI6ImFiY3NlZmdtZG1kZCIsInN1cm5hbWUiOiJueHNteG14ICIsImNvbXBhbnlJZCI6NCwiY29tcGFueU5hbWUiOiJVbmlrIiwiY291bnRyeSI6IklOIiwibGFuZ3VhZ2UiOiJlbiIsImltYWdlIjoiNTZlYjc3MmYtMzNlNC00ODA1LTgyNzEtMWRmNjk3Njk3MDMwIn0.4dY8-8nr-BqQMrVr9lseavN2ZrcLNEEWBnXN-T8z_VA",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async SignUp(params) {
    console.log("Paramss>>", params);
    return fetch(`${url}installation-management/account/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async Language(params) {
    return fetch(
      `${url}language-management/languages?searchText=&language=en&pageIndex=0&pageCount=10`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UpdateLanguage(params) {
    return fetch(`${url}user-management/users/current/language`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetCompany(params) {
    return fetch(`${url}company-management/companies/types`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetCountry(params) {
    return fetch(`${url}country-management/countries`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(params),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // get cities of a country
  async GetCity(params) {
    // console.log(
    //   "GET CIITY CONFIG",
    //   `${url}address-management/countries/${params.countryCode}/cities?searchText=${params.searchTxt}&pageIndex=${params.pageIndex}&pageCount=${params.pageCount}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: await fetchAuthToken(),
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    return await fetch(
      `${url}address-management/countries/${params.countryCode}/cities?searchText=${params.searchTxt}&pageIndex=${params.pageIndex}&pageCount=${params.pageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // get Country with session
  async GetCountries() {
    return await fetch(
      `${url}address-management/countries?searchText=&pageIndex=0&pageCount=1000`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetUserDetails() {
    return fetch(`${url}user-management/users/current`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async EditUserProfileData(params) {
    console.log("edit token", params);
    return fetch(`${url}user-management/users/current`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {});
  },

  async UploadUserProfile(params) {
    return fetch(`${url}user-management/users/current/image`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: await fetchAuthToken(),
        "Content-Type": "multipart/form-data",
      },
      body: params,
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async GetUsersList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}user-management/users?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async CreateUser(params) {
    console.log("params prefereed route", params);
    let data = { ...params };
    return fetch(`${url}user-management/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((e) => {});
  },

  async DeleteUser(UserId) {
    return fetch(`${url}user-management/users/` + UserId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async DeleteAccount() {
    console.log("userId", await fetchAuthToken());
    return fetch(`${url}user-management/users`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((e) => console.log("error Del", e));
  },

  async GetTrailerTypeList(SearchText, PageIndex, PageCount, TransportTypeId) {
    // trailer-management/transports/types/1/trailers/types?searchText=&pageIndex=0&pageCount=20
    //api/trailer-management/transports/types/:transportTypeId/trailers/types?searchText${SerachText}&pageIndex=${PageIndex}&pageCount=${PageCount}`
    let urlPath = `${url}trailer-management/trailers/types?searchText${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`;
    if (TransportTypeId)
      urlPath = `${url}trailer-management/transports/types/${TransportTypeId}/trailers/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`;
    // console.log("GetTrailerTypeList", urlPath);

    return fetch(urlPath, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetTrailerFloorTypeList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}trailer-management/trailers/floors/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetTrailerSpecificationTypeList(
    TrailerTypeId,
    SearchText,
    PageIndex,
    PageCount
  ) {
    return await fetch(
      `${url}trailer-management/trailers/specifications?trailerTypeId=` +
        TrailerTypeId +
        `&searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      console.log("Responseeeee", response);
      return [await response.json(), response.status];
    });
  },

  async GetTrailerDetails(TrailerId) {
    return fetch(`${url}trailer-management/trailers/` + TrailerId, {
      method: "GET",
      headers: {
        Authorization: await fetchAuthToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  async GetTrailerPlatePictureData(TrailerId) {
    return fetch(`${url}trailer-management/trailers/` + TrailerId + `/files`, {
      method: "GET",
      headers: {
        Authorization: await fetchAuthToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  async GetTrailerList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}trailer-management/trailers?searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  async AddTrailer(params) {
    return fetch(`${url}trailer-management/trailers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async EditTrailer(params) {
    return fetch(`${url}trailer-management/trailers`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async DeleteTrailer(TrailerId) {
    return fetch(`${url}trailer-management/trailers/` + TrailerId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UploadTrailerPlatePicture(TrailerId, params) {
    return fetch(
      `${url}trailer-management/trailers/` + TrailerId + `/files/plate/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "multipart/form-data",
        },
        body: params,
      }
    )
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {
        alert(error + "-------");
      });
  },

  // Vehicle
  async GetVehicleTypeList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}vehicle-management/vehicles/types?searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async AddVehicle(params) {
    // a = { "capacity": 0, "make": "", "model": "rfrgr", "plate": "6454", "vehicleType": { "vehicleTypeId": 1 }, "year": 0 }
    return fetch(`${url}vehicle-management/vehicles`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async EditVehicle(params) {
    return fetch(`${url}vehicle-management/vehicles`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async DeleteVehicle(VehicleId) {
    return fetch(`${url}vehicle-management/vehicles/` + VehicleId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetVehicleList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}vehicle-management/vehicles?searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UploadVehicleFiles(VehicleId, FileTypeName, params) {
    return fetch(
      `${url}vehicle-management/vehicles/` +
        VehicleId +
        `/files/` +
        FileTypeName +
        `/upload`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "multipart/form-data",
        },
        body: params,
      }
    )
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {});
  },

  async GetVehicleFilesData(VehicleId) {
    console.log("VehicleId====>>>>", VehicleId, await fetchAuthToken());
    return fetch(`${url}vehicle-management/vehicles/` + VehicleId + `/files`, {
      method: "GET",
      headers: {
        Authorization: await fetchAuthToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      // console.log("response==>>",await response.json())
      return [await response.json(), response.status];
    });
  },

  ////////////////////////
  async AddDriver(params) {
    return fetch(`${url}user-management/users/drivers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async EditDriver(params) {
    return fetch(`${url}user-management/users`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  // ????
  async DeleteDriver(DriverId) {
    return fetch(`${url}user-management/users/drivers/` + DriverId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetDriverList(SearchText, PageIndex, PageCount) {
    console.log(PageIndex);
    return fetch(
      `${url}user-management/users/drivers?searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  ///src/ licence
  async UploadDriverFiles(DriverId, FileTypeName, params) {
    let requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "multipart/form-data",
      },
      body: params,
    };

    return await fetch(
      `${url}user-management/users/${DriverId}/files/${FileTypeName}/upload`,
      requestOptions
    )
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error + "UploadDriverFiles" + FileTypeName);
        throw error;
      });
  },

  async GetDriverFilesData(DriverId) {
    return fetch(`${url}user-management/users/` + DriverId + `/files`, {
      method: "GET",
      headers: {
        Authorization: await fetchAuthToken(),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  ////////////
  // Freight
  // async GetFreightList(SearchText, PageIndex, PageCount, FilterOptions) {
  //   let urlWithParams =
  //     `${url}container-management/containers/carriers/filter?description=` +
  //     SearchText +
  //     `&pageIndex=` +
  //     PageIndex +
  //     `&pageCount=` +
  //     PageCount;

  //   if (FilterOptions) {
  //     // console.log("FilterOptions", FilterOptions);
  //     const {
  //       fromCountry,
  //       fromCity,
  //       toCountry,
  //       toCity,
  //       plannedDepartureDate,
  //       trailerSuitable,
  //     } = FilterOptions;

  //     if (trailerSuitable)
  //       urlWithParams = urlWithParams.concat(
  //         `&trailerSuitable=` + trailerSuitable
  //       );
  //     if (fromCountry?.id)
  //       urlWithParams = urlWithParams.concat(
  //         `&fromCountryCode=` + fromCountry?.id
  //       );
  //     if (fromCity?.id)
  //       urlWithParams = urlWithParams.concat(`&fromCityId=` + fromCity?.id);
  //     if (toCountry?.id)
  //       urlWithParams = urlWithParams.concat(`&toCountryCode=` + toCountry?.id);
  //     if (toCity?.id)
  //       urlWithParams = urlWithParams.concat(`&toCityId=` + toCity?.id);
  //   }

  //   console.log(urlWithParams, "urlWithParams");
  //   // `${url}container-management/containers/filter?searchText=` +
  //   return await fetch(urlWithParams, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: await fetchAuthToken(),
  //     },
  //   }).then(async (response) => {
  //     console.log("FreightRESPONSSS>>>", JSON.stringify(response));
  //     return [response.json(), response.status];
  //   });
  // },

  async GetFreightList(SearchText, PageIndex, PageCount, FilterOptions) {
    // `${url}container-management/containers/carriers/filter?description=` +
    let urlWithParams =
      `${url}container-management/containers/posts?description=` +
      SearchText +
      `&pageIndex=` +
      PageIndex +
      `&pageCount=` +
      PageCount;
    if (FilterOptions) {
      // console.log("FilterOptions", FilterOptions);
      const {
        fromCountry,
        fromCity,
        toCountry,
        toCity,
        plannedDepartureDate,
        trailerSuitable,
      } = FilterOptions;
      if (trailerSuitable)
        urlWithParams = urlWithParams.concat(
          `&trailerSuitable=` + trailerSuitable
        );
      if (fromCountry?.id)
        urlWithParams = urlWithParams.concat(
          `&fromCountryCode=` + fromCountry?.id
        );
      if (fromCity?.id)
        urlWithParams = urlWithParams.concat(`&fromCityId=` + fromCity?.id);
      if (toCountry?.id)
        urlWithParams = urlWithParams.concat(`&toCountryCode=` + toCountry?.id);
      if (toCity?.id)
        urlWithParams = urlWithParams.concat(`&toCityId=` + toCity?.id);
    }
    return await fetch(urlWithParams, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  // Adding New Section

  // async GetFreightSignedList(SearchText, PageIndex, PageCount) {
  //   let urlWithParams =
  //     `${url}container-management/containers/carriers/posts?description=` +
  //     SearchText +
  //     `&pageIndex=` +
  //     PageIndex +
  //     `&pageCount=` +
  //     PageCount;

  //   return await fetch(urlWithParams, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: await fetchAuthToken(),
  //     },
  //   }).then(async (response) => {
  //     return [await response.json(), response.status];
  //   });
  // },

  async GetFreightSignedList(SearchText, PageIndex, PageCount) {
    let urlWithParams =
      `${url}container-management/containers/carriers/posts?description=` +
      SearchText +
      `&pageIndex=` +
      PageIndex +
      `&pageCount=` +
      PageCount;
    return await fetch(urlWithParams, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // Transport
  async GetUserTransportList(params) {
    console.log("GetUserTransportList==>>", params);
    //{{rivalog_url}}/api/transport-management/transports/types?searchText=&pageIndex=0&pageCount=10
    return fetch(`${url}transporter-management/transporters`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status, params];
    });
  },

  async CreateTransporter(params) {
    console.log("CreateTransporter==>>>", params);
    return fetch(`${url}transporter-management/transporters`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      console.log("response CreateTransporter==>>>", await response);
      return [await response.json(), response.status];
    });
  },

  // Save Device Token Notification
  async SaveUserDeviceToken(params) {
    return fetch(`${url}notification-management/notifications/tokens`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        console.log(">>>>>>>>>>>>>>>>>", response.json, response.status);
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  // get notification
  async GetNotificationList() {
    console.log(await fetchAuthToken());
    return fetch(`${url}notification-management/notifications`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // set notification state
  async SetNotificationStateAsRead(notificationId) {
    return fetch(
      `${url}notification-management/notifications/` + notificationId + `/read`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // set notification state
  async CreateTransporterGPSPoint(params) {
    // console.log(`${ url }transporter-management/points`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: await fetchAuthToken(),
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(params),
    //   }, "<-----------jiren")
    let GPSPoint = {
      latitude: params.latitude,
      longitude: params.longitude,
    };

    return fetch(`${url}transporter-management/points`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(GPSPoint),
    }).then(async (response) => {
      console.log("CreateTransporterGPSPoint response: ", response.status);
      return [await response.json(), response.status, params.UID];
    });
  },

  //create freight
  async CreateTransportApplication(params) {
    console.log(params, "transport param");
    console.log(await fetchAuthToken());
    return fetch(`${url}transport-management/transports/applications`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async DeleteTransportApplication(params) {
    return fetch(`${url}transport-management/transports/applications`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async AddBankAccount(params) {
    return fetch(`${url}bank-account-management/accounts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async EditBankAccount(params) {
    return fetch(`${url}bank-account-management/accounts`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async DeleteBankAccount(BankAccountID) {
    return fetch(`${url}bank-account-management/accounts/` + BankAccountID, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      // alert(response.status)
      return [response.json(), response.status];
    });
  },

  async GetBankAccountDetails(bankAccountId) {
    return fetch(`${url}bank-account-management/accounts/` + bankAccountId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        return [response.json(), response.status];
      })
      .catch((error) => {
        alert(error);
      });
  },

  async GetBankAccountList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}bank-account-management/accounts?searchText=` +
        SearchText +
        `&pageIndex=` +
        PageIndex +
        `&pageCount=` +
        PageCount,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [response.json(), response.status];
    });
  },

  async GetDashboard(params) {
    console.log("token==>>", await fetchAuthToken());
    console.log("123");
    return fetch(`${url}dashboard-management/carrier/mobile/items`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Cache-Control": "no-cache",
      },
    }).then(async (response) => {
      console.log("LOGIN>>>>>>>>>>", JSON.stringify(response));
      return [await response.json(), response.status, params];
    });
  },

  async GetHomePage(params) {
    return fetch(`${url}dashboard-management/portal/items`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Cache-Control": "no-cache",
      },
    }).then(async (response) => {
      return [await response.json(), response.status, params];
    });
  },

  async SetAsPrimary(params) {
    return fetch(
      `${url}bank-account-management/accounts/${params.bankAccountId}/primary`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  //Preffered Route
  async DeletePrefferedRoute(params) {
    return fetch(`${url}preferred-route-management/routes/${params}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async AddPrefferedRoute(params) {
    console.log("params prefereed route", params);
    return fetch(`${url}preferred-route-management/routes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params.data),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((e) => {});
  },

  async UpdatePrefferedRoute(params) {
    return fetch(`${url}preferred-route-management/routes`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params.data),
    })
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((e) => {});
  },

  async GetPrefferedRoute(params) {
    return fetch(
      `${url}preferred-route-management/routes?searchText=${params.searchTxt}&pageIndex=${params.pageIndex}&pageCount=${params.pageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetFreightStatus(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}freight-management/freights/statuses?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetMyFreight(
    SearchText = "",
    PageIndex,
    PageCount,
    freightStatusId,
    companyId
  ) {
    // console.log(
    //   `freight-management/freights/filter?pageIndex=${PageIndex}&pageCount=${PageCount}&freightStatusId=${freightStatusId}&companyId=${companyId}&description=${SearchText}`
    // );

    return fetch(
      `${url}freight-management/freights/filter?pageIndex=${PageIndex}&pageCount=${PageCount}&freightStatusId=${freightStatusId}&companyId=${companyId}&description=${SearchText}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetFreight(freightId) {
    return fetch(`${url}freight-management/freights/${freightId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetInvoiceAddresses(SearchText = "", PageIndex, PageCount) {
    return fetch(
      `${url}address-management/addresses/invoices?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async AddNewInvoiceAddress(params) {
    let data = { ...params };

    console.log("new billing address", data);
    return fetch(`${url}address-management/addresses/invoices`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UpdateInvoiceAddress(params) {
    let data = { ...params };

    console.log("update billing address", data);
    return fetch(`${url}address-management/addresses/invoices`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async SetPrimaryInvoiceAddress(params) {
    return fetch(
      `${url}address-management/addresses/invoices/${params}/primary`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetCurrentCompanyInfo(params) {
    return fetch(`${url}company-management/companies/current`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UpdateCurrentCompanyInfo(params) {
    let data = { ...params };

    console.log("update", data);
    return fetch(`${url}company-management/companies`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async ActiveDeactivePreRoute(params) {
    return fetch(
      `${url}preferred-route-management/routes/${
        params.type == 0 ? "activate" : "deactivate"
      }/${params.ID}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async ChangePassword(params) {
    console.log("resetpasswrodparams", typeof params, params);
    return fetch(`${url}user-management/users/current/password`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async UpdateTransporterStatus(params) {
    return fetch(`${url}transporter-management/transporters/statuses`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: JSON.stringify({ status: params.status }),
    }).then(async (response) => {
      const resp = await response.json().then(async (res) => ({
        res,
        status: response.status,
        uid: params.uid,
        color: params.color,
        paramStatus: params.status,
      }));

      return resp;
    });
  },

  async SetNotificationToken(params) {
    let data = { ...params, channel: "MOBILE" };

    console.log(data, "notiiiiiiiiiiii");
    return fetch(`${url}notification-management/notifications/tokens`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetAddress(SearchText, PageIndex, PageCount = 20) {
    return fetch(
      `${url}address-management/addresses?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetAddressById(id) {
    return fetch(`${url}address-management/addresses/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async AddNewAddress(params) {
    return fetch(`${url}address-management/addresses`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async EditAddress(params) {
    return fetch(`${url}address-management/addresses`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetDistanceMatrix({ fromCityId, toCityId, date = "" }) {
    return await fetch(
      `${url}distance-matrix-management/distance/from/cities?fromCityId=${fromCityId}&toCityId=${toCityId}&departureDate=${date}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetCurrencyList() {
    return await fetch(`${url}currency-management/currencies`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetRefreshToken() {
    console.log("inside API refresh tokenn ");
    return fetch(`${url}user-management/users/tokens/refresh`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  // FREIGHT
  async GetFreightTypeList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}freight-management/freights/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetTransportTypeList(SearchText, PageIndex, PageCount) {
    return fetch(
      `${url}transport-management/transports/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        return [await response.json(), response.status];
      })
      .catch((e) => console.log("Catch", e));
  },

  async GetFreightContentTypeList(SearchText, PageIndex, PageCount = 1000) {
    return await fetch(
      `${url}freight-management/freights/contents/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetPackagingType(SearchText, PageIndex, PageCount = 1000) {
    return await fetch(
      `${url}freight-management/freights/packages/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetLoadingType(SearchText, PageIndex, PageCount = 1000) {
    return await fetch(
      `${url}freight-management/freights/loading/types?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetGtipList(SearchText, PageIndex, PageCount = 20) {
    return await fetch(
      `${url}freight-management/harmonizedsystemcodes?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async createFreight(params) {
    return await fetch(`${url}freight-management/freights/carriers`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async updateFreight(params) {
    return await fetch(`${url}freight-management/freights/carriers`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async FreightSendForApproval(id) {
    return await fetch(
      `${url}freight-management/freights/${id}/approval/send`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async AddressDelete(id) {
    return await fetch(`${url}address-management/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async FreightDelete(id) {
    return await fetch(`${url}freight-management/freights/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetFreightLocations(PageIndex, PageCount = 1000) {
    return await fetch(
      `${url}transporter-management/transporters/tracking?pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async GetContainerProposalList(SearchText, PageIndex, PageCount) {
    // console.log("SearchText", SearchText);
    // console.log(
    //   "url",
    //   `${url}container-management/proposals/scopes?searchText=${SearchText}pageIndex=${PageIndex}&pageCount=${PageCount}`
    // );
    return await fetch(
      `${url}container-management/proposals/scopes?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetSelectedContainerProposal(containerId) {
    return await fetch(
      `${url}container-management/containers/${containerId}/proposals/carriers/drivers`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetContainerProposal(containerId, PageIndex, PageCount) {
    return await fetch(
      `${url}container-management/containers/${containerId}/proposals?pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      const data = await response.json();
      return data;
    });
  },

  async CreateContainerProposal(params) {
    console.log("CreateContainerProposal", params, await fetchAuthToken());
    return await fetch(`${url}container-management/containers/proposals`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async EditContainerProposal(params) {
    console.log("EditContainerProposal", params);
    return await fetch(`${url}container-management/containers/proposals`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: await fetchAuthToken(),
      },
      body: params,
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async DeleteContainerProposal(proposalId) {
    console.log("DelContainerProposal>>>>>>>", proposalId);
    return await fetch(
      `${url}container-management/containers/proposals/${proposalId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async GetFreightInContainer(containerId) {
    return await fetch(
      `${url}container-management/containers/${containerId}/freights`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async UpdateFreightLoaded(freightId) {
    return fetch(`${url}freight-management/freights/${freightId}/loaded`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async UpdateFreightDelivered(freightId) {
    return fetch(`${url}freight-management/freights/${freightId}/delivered`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
      },
    }).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async GetMainContainerCompanyList(SearchText, PageIndex, PageCount) {
    return await fetch(
      `${url}company-management/companies/main/contractors?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },

  async GetSubContractList(SearchText, PageIndex, PageCount) {
    return await fetch(
      `${url}transporter-management/transporters/subcontracts?searchText=${SearchText}&pageIndex=${PageIndex}&pageCount=${PageCount}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: await fetchAuthToken(),
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
  async CreateSubContract(params) {
    console.log("Create Sub contract==>>>", params);
    return fetch(`${url}transporter-management/transporters/subcontracts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: await fetchAuthToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      console.log("response create subContract==>>>", await response);
      return [await response.json(), response.status];
    });
  },
  async DeleteSubContract(subContractId) {
    return fetch(
      `${url}transporter-management/transporters/subcontracts/` + subContractId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: await fetchAuthToken(),
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      return [await response.json(), response.status];
    });
  },
};

// const Refresh = async () => {
//   fetch(
//     `${url}user-management/users/tokens/refresh`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: await fetchAuthToken(),
//       },
//     }
//     ).then(async (response) => {
//       console.log("Refreshtoken Response",await response.json(),response.status)
//       // return [await response.json(), response.status];
//   })

// }

const fetchAuthToken = async () => {
  try {
    return "Bearer " + (await AsyncStorage.getItem("AccessToken"));
  } catch (e) {
    console.error(e);
  }
};
