import AsyncStorage from "@react-native-async-storage/async-storage";
import { authCtx } from "../../navigation/Router";

export const signOut = async () => {
  try {
    authCtx?.signOut();
  } catch (e) {
    console.error(e);
  }
};
