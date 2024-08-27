import React, { useState } from "react";
import { format as changeFormat } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { HelperText } from "react-native-paper";
import DropDownField, { DropDownField2 } from "./DropDownField";
import { global } from "../global";

export const DatePickerButton = ({
  stateDate,
  onChange,
  format = "dd/MMM/yyyy",
  helper,
  title,
  placeholder,
  disabled,
}) => {
  const [show, setShow] = useState(false);
  let formatedDate = null;

  if (stateDate !== null) {
    formatedDate = changeFormat(stateDate, format);
  }

  const showDatepicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const onChangeDate = (v) => {
    const currentDate = v;
    try {
      hideDatePicker();
      onChange(v);
    } catch (e) {
      console.error("Date picker event", currentDate, e);
    }
  };

  return (
    <>
      <DropDownField
        name={title}
        placeholder={placeholder}
        value={formatedDate}
        onPress={showDatepicker}
        icon={"calendar-outline"}
        disabled={disabled}
      />

      <DateTimePickerModal
        isVisible={show}
        value={stateDate || new Date()}
        mode={"date"}
        display="calendar"
        onConfirm={onChangeDate}
        onCancel={hideDatePicker}
      />

      {helper && <HelperText type="error">{helper}</HelperText>}
    </>
  );
};

export const DatePickerButton2 = ({
  stateDate,
  onChange,
  format = global.dataFormat,
  minDate = new Date(),
  helper,
  title,
  placeholder,
  disabled,
  mode,
  icon,
  styles,
}) => {
  const [show, setShow] = useState(false);
  let formatedDate = null;
  let display = mode === "time" ? "clock" : "calendar";

  if (stateDate !== null) {
    formatedDate = changeFormat(stateDate, format);
  }

  const showDatepicker = () => {
    setShow(true);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  const onChangeDate = (v) => {
    const currentDate = v;
    try {
      hideDatePicker();
      onChange(v);
    } catch (e) {
      console.error("Date picker event", currentDate, e);
    }
  };

  return (
    <>
      <DropDownField2
        name={title}
        placeholder={placeholder}
        value={formatedDate}
        onPress={showDatepicker}
        icon={icon ?? "calendar"}
        disabled={disabled}
        styles={styles}
      />

      <DateTimePickerModal
        isVisible={show}
        value={stateDate}
        mode={mode ?? "date"}
        // display={display}
        onConfirm={onChangeDate}
        onCancel={hideDatePicker}
        minimumDate={minDate}
      />

      {helper && <HelperText type="error">{helper}</HelperText>}
    </>
  );
};
