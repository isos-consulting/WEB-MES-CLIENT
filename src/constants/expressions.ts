const EXPRESSSIONS = {
  HOUR_MINUTE: /^([1-9]|[01]\d|2[0-3]):([0-5]\d)$/,
  HOUR_MINUTE_SECOND: /^([1-9]|[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  NON_DIGIT_GLOBAL: /\D/g,
  DECIMAL_OPTIONAL_SIGN_COMMA_DOT:
    /^[+\-]?(([1-9]\d{0,2}(,\d{3})*)|\d+){1}(\.\d+)?$/,
  DECIMAL_OPTIONAL_COMMA_DOT: /^(([1-9]\d{0,2}(,\d{3})*)|\d+){1}(\.\d+)?$/,
  DECIMAL_OPTIONAL_DOT: /^\d+(\.\d+)?$/,
  COMMA_GLOBAL: /,/g,
};

export default EXPRESSSIONS;
