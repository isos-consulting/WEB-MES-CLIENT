import EXPRESSSIONS from '~/constants/expressions';
import { isEmpty } from '~/helper/common';

/**
 * 숫자 타입인지 판정 (인자값이 숫자인 경우 true를 반환)
 * @param value 판정할 값
 * @returns boolean
 * @example
 * isNumber('123') // true
 */

export function isNumber(value: string | number): boolean {
  // 좌우 trim(공백제거)을 해준다.
  const trimedStr = String(value).replace(/(?:^\s+)|(?:,+)|(?:\s+$)/g, '');

  if (isEmpty(trimedStr)) return false;
  if (isNaN(Number(trimedStr))) return false;

  // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
  if (EXPRESSSIONS.DECIMAL_OPTIONAL_SIGN_COMMA_DOT.test(trimedStr)) {
    const commaRemoveStr = trimedStr.replace(EXPRESSSIONS.COMMA_GLOBAL, '');
    if (isNaN(Number(commaRemoveStr))) return false;

    return true;
  }
  return false;
}
