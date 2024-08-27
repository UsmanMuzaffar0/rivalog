import React, { useEffect, useRef, useState } from "react";
import FreightOwnerInformation from "../components/Dashboard/FreightOwnerInformation";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import * as colors from "../common/colors";
import CustomDrawer from "./CustomFreighOwnerSiderbar.js";
import { BadgeContext, StatuscodeContext } from "./AuthContext";
import stringsoflanguages from "../Localization/stringsoflanguages";
import AddBillingAddress from "../components/FreightOwner/Freight/BillingAddress/AddBillingAddress";
import MyFrieghtUpload from "../components/FreightOwner/Freight/MyFreight/MyFrieghtUpload";
import BillingAddresses from "../components/FreightOwner/Freight/BillingAddress/BillingAddresses";
import Home from "../components/FreightOwner/Dashboard/Home";
import User from "../components/FreightOwner/Users/Users";
import AddNewUser from "../components/FreightOwner/Users/AddNewUser";
import CompanyInfo from "../components/FreightOwner/Company/CompayInfo";
import CreateFreightStep1 from "../components/FreightOwner/Freight/CreateNewFreight/Step1";
import CreateFreightStep2 from "../components/FreightOwner/Freight/CreateNewFreight/Step2";
import CreateFreightStep3 from "../components/FreightOwner/Freight/CreateNewFreight/Step3";
import CreateFreightStep4 from "../components/FreightOwner/Freight/CreateNewFreight/Step4";
import PreviewCreateFreight from "../components/FreightOwner/Freight/CreateNewFreight/PreviewInfo";
import EditFreight from "../components/FreightOwner/Freight/MyFreight/editFreight";
import ViewFreight from "../components/FreightOwner/Freight/MyFreight/ViewFreights";
import FreightLocations from "../components/FreightOwner/Freight/FreightsLocation";
import Addresses from "../components/FreightOwner/Addresses";
import Settings from "../components/Dashboard/Settings/Settings";
import Language from "../components/Dashboard/Settings/Language";
import FreightSetting from "../components/Dashboard/Settings/FreighSetting";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerIcons = ({ size, focused, icon, material }) => {
  if (material)
    return (
      <MaterialCommunityIcons
        size={size}
        color={focused ? colors.PastelGreen : colors.LightGrey}
        name={icon}
      />
    );

  return (
    <Ionicons
      size={size}
      color={focused ? colors.PastelGreen : colors.LightGrey}
      name={icon}
    />
  );
};

const CreateFreightStack = () => {
  return (
    <Stack.Navigator
      // initialRouteName="PreviewCreateFreight"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="CreateFreightStep1"
        component={CreateFreightStep1}
        initialParams={{
          title: "Create New Freight",
        }}
        options={{
          title: "Create New Freight",
        }}
      />
      <Drawer.Screen
        name="CreateFreightStep2"
        component={CreateFreightStep2}
        initialParams={{
          title: "Step 2",
        }}
        options={{
          title: "Step 2",
        }}
      />
      <Drawer.Screen
        name="CreateFreightStep3"
        component={CreateFreightStep3}
        initialParams={{
          title: "Step 3",
        }}
        options={{
          title: "Step 3",
        }}
      />
      <Drawer.Screen
        name="CreateFreightStep4"
        component={CreateFreightStep4}
        initialParams={{
          title: "Step 4",
        }}
        options={{
          title: "Step 4",
        }}
      />
      <Drawer.Screen
        name="PreviewCreateFreight"
        component={PreviewCreateFreight}
        initialParams={{
          title: "Preview Preferences",
        }}
        options={{
          title: "Preview Preferences",
        }}
      />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Users" component={User} />
      <Drawer.Screen
        name="AddNewUser"
        component={AddNewUser}
        options={{
          title: "Add New User",
        }}
      />
    </Stack.Navigator>
  );
};
const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Setting" component={FreightSetting} />
      <Drawer.Screen name="Language" component={Language} />
    </Stack.Navigator>
  );
};

const BillingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="BillingAddresses"
        component={BillingAddresses}
        options={{
          title: "Billing Addresses",
        }}
      />
      <Drawer.Screen
        name="AddBillingAddress"
        component={AddBillingAddress}
        options={{
          title: "Add Billing Addresses",
        }}
      />
    </Stack.Navigator>
  );
};

const AddressesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Addresses"
        component={Addresses}
        initialParams={{
          title: "Addresses",
        }}
        options={{
          title: "Addresses",
        }}
      />
    </Stack.Navigator>
  );
};

const MyFreightStack = (props) => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    {...props}
  >
    <Stack.Screen
      name="MyFrieghtUpload"
      component={MyFrieghtUpload}
      initialParams={{
        title: "My Freight",
      }}
    />
    <Stack.Screen
      name="EditFreight"
      component={EditFreight}
      options={{
        title: "Edit Freight",
        notVisibleInDrawer: true,
      }}
      initialParams={{
        title: "Edit Freight",
      }}
    />
    <Stack.Screen
      name="ViewFreight"
      component={ViewFreight}
      options={{
        title: "View Freight",
        notVisibleInDrawer: true,
      }}
      initialParams={{
        title: "View Freight",
      }}
    />
  </Stack.Navigator>
);

function FreightNavigator({ navigation }) {
  const [code, setcode] = useState("");
  const codeRef = useRef("");
  const CodeContext = React.useMemo(
    () => ({
      settransCode: async (code) => {
        console.log("codeeeeeee", code);
        setcode(code);
        codeRef.current = code;
      },
      getCode: () => {
        return codeRef.current;
      },
    }),
    []
  );

  useEffect(() => {
    (async () => {
      stringsoflanguages.setLanguage(
        await AsyncStorage.getItem("SelectedLanguage")
      );
    })();
    return () => {};
  }, []);

  return (
    <>
      <StatuscodeContext.Provider value={CodeContext}>
        <Drawer.Navigator
          screenOptions={() => ({
            headerShown: false,
            tabBarVisible: true,
            drawerStyle: { width: "75%" },
            drawerActiveTintColor: colors.LimeGreen,
            swipeEnabled: false,
          })}
          drawerContent={(props) => <CustomDrawer {...props} Code={code} />}
        >
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "home",
                }),
            }}
          />
          <Drawer.Screen
            name="CreateFreightStack"
            component={CreateFreightStack}
            options={{
              title: "Create New Freight",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "add-circle",
                }),
            }}
          />
          {/* My Freights */}
          <Drawer.Screen
            name="MyFreightStack"
            component={MyFreightStack}
            options={{
              title: "My Freight",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "bookmark",
                }),
            }}
          />
          <Drawer.Screen
            name="EditFreight"
            component={EditFreight}
            options={{
              title: "Edit Freight",
              notVisibleInDrawer: true,
            }}
            initialParams={{
              title: "Edit Freight",
            }}
          />
          <Drawer.Screen
            name="ViewFreight"
            component={ViewFreight}
            options={{
              title: "View Freight",
              notVisibleInDrawer: true,
            }}
            initialParams={{
              title: "View Freight",
            }}
          />
          <Drawer.Screen
            name="FreightLocations"
            component={FreightLocations}
            options={{
              title: "Where are my Freights",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "map-marker-path",
                  material: true,
                }),
            }}
            initialParams={{
              title: "Where are my Freights",
            }}
          />
          <Drawer.Screen
            name="BillingStack"
            component={BillingStack}
            options={{
              title: "Billing Addresses",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "location",
                }),
            }}
          />
          <Drawer.Screen
            name="AddressesStack"
            component={AddressesStack}
            options={{
              title: "Addresses",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "location",
                }),
            }}
          />

          <Drawer.Screen
            name="UserStack"
            component={UserStack}
            options={{
              title: "Users",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "person-circle-outline",
                }),
            }}
          />
          <Drawer.Screen
            name="CompanyInfo"
            component={CompanyInfo}
            options={{
              title: "Company Info",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "toggle",
                }),
            }}
          />
          {/* <Stack.Screen
            name="FreightOwnerInformation"
            component={FreightOwnerInformation}
          /> */}
          <Stack.Screen
            name="Setting"
            component={SettingsStack}
            options={{
              title: "Setting",
              drawerIcon: ({ focused, size }) =>
                DrawerIcons({
                  focused,
                  size,
                  icon: "settings",
                }),
            }}
          />
        </Drawer.Navigator>
      </StatuscodeContext.Provider>
    </>
  );
}

export default FreightNavigator;
