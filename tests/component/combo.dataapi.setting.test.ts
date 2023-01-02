import { useComboDatas } from '../../src/components/UI/combobox/multi-select/data-setting-option.hook';
import React from 'react';

jest.mock('antd');

jest.mock('../../src/components/UI/datagrid-new/datagrid.ui.tsx');
jest.mock('../../src/functions', () => {
  return {
    getData: jest.fn(async () => {
      return [{ cd: '1', nm: '2' }];
    }),
  };
});

describe('콤보박스 데이터 조회 테스트', () => {
  beforeEach(() => {
    jest.spyOn(React, 'useState').mockImplementation(initialState => {
      let name: unknown[] = initialState as unknown[];

      return [name, jest.fn(value => name.splice(0, name.length, ...value))];
    });

    jest.spyOn(React, 'useEffect').mockImplementation((callback, dept) => {
      const cb = callback as () => void;
      cb();
    });
  });

  test('comboData 함수는 빈 배열을 반환한다', () => {
    const { comboData } = useComboDatas({
      params: {},
      uriPath: '',
      codeName: 'cd',
      textName: 'nm',
    });

    expect(comboData).toEqual([]);
  });

  test('comboApi 함수는 MES 서버에서 응답한 데이터의 결과를 반환한다', async () => {
    const { comboApi } = useComboDatas({
      params: {},
      uriPath: '',
      codeName: 'cd',
      textName: 'nm',
    });
    const result = await comboApi();

    expect(result).toEqual([{ value: '1', label: '2' }]);
  });

  test('comboApi 함수를 호출하면 comboData의 값이 변경된다', async () => {
    const { comboData, comboApi } = useComboDatas({
      params: {},
      uriPath: '',
      codeName: 'cd',
      textName: 'nm',
    });

    await comboApi();

    expect(comboData).toEqual([{ value: '1', label: '2' }]);
  });
});
