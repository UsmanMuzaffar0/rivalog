import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

export const showSucces = ({ title = "Success", description = "", onHide }) =>
  showMessage({
    message: title,
    type: "success",
    description,
    animated: true,
    duration: 4000,
    titleStyle: styles.textStyle,
    textStyle: styles.textStyle,
    onHide: onHide,
  });

export const showFailure = ({ title = "Error", description, onHide }) =>
  showMessage({
    message: title,
    type: "danger",
    description,
    duration: 4000,
    animated: true,
    titleStyle: styles.textStyle,
    textStyle: styles.textStyle,
    onHide: onHide,
  });

export const showInfo = ({ title = "Success", description = "", onHide }) =>
  showMessage({
    message: title,
    type: "info",
    description,
    animated: true,
    titleStyle: styles.textStyle,
    textStyle: styles.textStyle,
    onHide,
  });

const styles = StyleSheet.create({
  textStyle: {
    textAlign: "center",
  },
});
