import { getDate, getTime, parseISO } from "date-fns";
import { format as changeFormat } from "date-fns";
import { global } from "../global";

export const combineDateTimeISO = (date, time) => {
  try {
    return `${date.split("T")[0]}T${time.split("T")[1]}`;
  } catch (e) {
    console.log(e);
  }
};

export const combineDateTime = (date, time) => {
  try {
    return new Date(
      `${new Date(date).toDateString()} ${new Date(time).toTimeString()}`
    );
  } catch (e) {
    console.log(e);
  }
};

export const getUnixTimeStamp = (date) => {
  try {
    return getTime(date); // in millisecond
  } catch (e) {
    console.log(e);
  }
};

export const changeDateFormat = (date, format = global.dataFormat) => {
  try {
    return changeFormat(parseISO(date), format);
  } catch (e) {
    console.error(e);
  }
};

export const changeUnixDateFormat = (date, format = global.dataFormat) => {
  try {
    return changeFormat(date, format);
  } catch (e) {
    console.error(e);
  }
};
