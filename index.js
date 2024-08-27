/**
 * @format
 */
import "react-native-gesture-handler";
import { AppRegistry, LogBox } from "react-native";
import App from "./App";
// import Notification from './src/components/Dashboard/Notification/Notification';
import { name as appName } from "./app.json";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('Notification', () =>
//   require(Notification)
// );
