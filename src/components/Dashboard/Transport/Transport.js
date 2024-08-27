import React from "react";
import { View, StatusBar } from "react-native";
import { AuthContext } from "../../../navigation/AuthContext";
import * as colors from "../../../common/colors";
import {
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetVehicleTypeListAction,
  GetCountryAction,
} from "../../../Redux/actions";
import NetChecker from "../../../common/Component/Network";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FreightList from "../Freight/FreightList";
class Transport extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.defaultState = {
      loading: false,

      TrailerTypesAry: [],
      FloorTypeAry: [],
    };
    this.state = { ...this.defaultState };
  }

  async componentDidMount() {
    this._Reload = this.props.navigation.addListener("focus", () => {
      this.setState({ ...this.defaultState });
    });

    const NetworkStatus = NetChecker();
    if ((await NetworkStatus) == false) {
      alert("network issue ");
    }
    this.setState({ loading: true });
    this.props.GetTrailerTypeListAction("", 0, 20);
    this.props.GetTrailerFloorTypeListAction("", 0, 20);
    this.props.GetVehicleTypeListAction("", 0, 20);
    this.props.GetCountryAction();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.TrailerTypeList.GetTrailerTypeListSuccess) {
      if (nextProps.TrailerTypeList.data[1] == 200) {
        AsyncStorage.setItem(
          "TrailerTypeList",
          JSON.stringify(await nextProps.TrailerTypeList.data[0])
        );
      } else if (nextProps.TrailerTypeList.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      } else {
        console.log("nextProps.TrailerTypeList");
      }
    }

    if (nextProps.TrailerFloorTypeList.GetTrailerFloorTypeListSuccess) {
      if (nextProps.TrailerFloorTypeList.data[1] == 200) {
        AsyncStorage.setItem(
          "TrailerFloorTypeList",
          JSON.stringify(await nextProps.TrailerFloorTypeList.data[0])
        );
      } else if (nextProps.TrailerFloorTypeList.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      } else {
        console.log("nextProps.TrailerFloorTypeList");
      }
    }

    if (nextProps.VehicleTypeList.GetVehicleTypeListSuccess) {
      if (nextProps.VehicleTypeList.data[1] == 200) {
        AsyncStorage.setItem(
          "VehicleTypeList",
          JSON.stringify(await nextProps.VehicleTypeList.data[0])
        );
      } else if (nextProps.VehicleTypeList.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      } else {
        console.log("nextProps.VehicleTypeList");
      }
    }

    if (nextProps.CountryData.GetCountrySuccess) {
      if (nextProps.CountryData.data[1] == 200) {
        AsyncStorage.setItem(
          "CountryList",
          JSON.stringify(await nextProps.CountryData.data[0])
        );
      } else if (nextProps.CountryData.data[1] == 401) {
        const SignOutContext = this.context;
        SignOutContext.signOut();
      } else {
        console.log("nextProps.CountryData");
      }
    }

    this.setState({ loading: false });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar
          translucent
          backgroundColor={colors.WhiteSmoke}
          barStyle={"dark-content"}
        />
        <FreightList />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    TrailerTypeList: state.TrailerTypeList,
    TrailerFloorTypeList: state.TrailerFloorTypeList,
    VehicleTypeList: state.VehicleTypeList,
    CountryData: state.CountryData,
  };
};
export default connect(mapStateToProps, {
  GetTrailerTypeListAction,
  GetTrailerFloorTypeListAction,
  GetVehicleTypeListAction,
  GetCountryAction,
})(Transport);
