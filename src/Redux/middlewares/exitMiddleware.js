import { showFailure, showSucces } from "../../common/Utils/flashMessage";
import { signOut } from "../../common/Utils/logout";
import Api from "../../common/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CodePush from "react-native-code-push";

export const exitOnStatusCode = (store) => (next) => async (action) => {
  if (action.payload?.[1] === 401 || action.payload?.[1] === 403) {
    try {
      // Call refresh token API and replace the token in AsyncStorage
      const [responseJson, responseStatus] = await Api.GetRefreshToken();
      if (responseStatus === 200) {
        console.log("NewToken", responseJson);
        const newToken = responseJson?.token;
        if (newToken) {
          AsyncStorage.setItem("AccessToken", newToken);
          // msg show token frsh  success, app Restart
          showFailure({
            description: "Refreshed the token, restarting the app",
          });
          setTimeout(() => {
            CodePush.restartApp();
          }, 2000);
        } else {
          console.error("New token not found in the response");
        }
      } else {
        console.error("Token refresh failed:", responseJson);
        signOut();
        showFailure({ description: "Token Expired. Re-login!" });
      }
    } catch (e) {
      console.error("Error while refreshing token:", e);
      signOut(); // Perform sign out if an error occurred during token refresh
      showFailure({ description: "Token Expired. Re-login!" });
    }
  } else {
    // If the response status is not 401 or 403, continue with the next action
    return next(action);
  }
};
