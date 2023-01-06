import { isOriginalsIncludesColumnName } from '~/functions/datagrid-new.function';

describe('onLoadPopup 함수는 react 내장 훅으로 정의되어 있으므로 가짜 함수를 이용한다', () => {
  test('isOriginalsIncludesColumnName 함수는 columnName이 columns의 original에 포함되어 있으면 true를 반환한다', () => {
    const columnName = 'userId';
    const columns = [{ original: 'userNm' }, { original: 'userId' }];

    const result = isOriginalsIncludesColumnName(columns, columnName);

    expect(result).toBe(true);
  });

  test('isOriginalsIncludesColumnName 함수는 columnName이 columns의 original에 포함되어 있지 않으면 false를 반환한다', () => {
    const columnName = 'userId';
    const columns = [{ original: 'userNm' }, { original: 'userBirth' }];

    const result = isOriginalsIncludesColumnName(columns, columnName);

    expect(result).toBe(false);
  });
});
