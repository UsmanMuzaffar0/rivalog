export function RegexIsDigit(str) {
  var reg = /^\d+$/; // This regex matches one or more digits from start to end of the string
  return reg.test(str);
}

export function RegexisValidNumber(str) {
  // This regex matches zero or more digits optionally followed by a dot and zero or more digits
  // It also matches a dot without any digits
  var pattern = /^[0-9.]*$/;
  return pattern.test(str);
}
