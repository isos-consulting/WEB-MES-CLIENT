const EXPRESSSIONS = {
  HOUR_MINUTE: /^([1-9]|[01]\d|2[0-3]):([0-5]\d)$/,
  HOUR_MINUTE_SECOND: /^([1-9]|[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
  NON_DIGIT_GLOBAL: /\D/g,
  DECIMAL_OPTIONAL_SIGN_COMMA_DOT_GLOBAL:
    /^[+\-]?(([1-9]\d{0,2}(,\d{3})*)|\d+){1}(\.\d+)?$/g,
  DECIMAL_OPTIONAL_COMMA_DOT_GLOBAL:
    /^(([1-9]\d{0,2}(,\d{3})*)|\d+){1}(\.\d+)?$/g,
  DECIMAL_OPTIONAL_DOT_GLOBAL: /\D+(\.\d+)?$/g,
};

export default EXPRESSSIONS;
