import NetInfo from "@react-native-community/netinfo";

const NetChecker = async () => {
  const networkStatus = NetInfo.fetch().then((state) => {
    return state.isConnected;
  });
  // console.log("networkStatus", await networkStatus);
  return await networkStatus;
};

const NetChecker2 = async () => {
  let networkStatus = false;
  await NetInfo.fetch().then((state) => {
    networkStatus = state.isConnected;
  });
  return networkStatus;
};

export default NetChecker2;
