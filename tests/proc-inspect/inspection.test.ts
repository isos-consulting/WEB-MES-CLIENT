import {
  extract_insp_ItemEntriesAtCounts,
  isColumnNameNotIncludes_insp_value,
} from '~/components/pages/prd/work/proc-inspection/proc-inspection-service';

test('x1_insp_value 문자열은 거짓을 반환한다', () => {
  const x1_insp_value = 'x1_insp_value';

  const falsyx1_insp_value = isColumnNameNotIncludes_insp_value([
    { columnName: x1_insp_value },
  ]);

  expect(falsyx1_insp_value).toBe(false);
});

test('"_insp_value" 문자열을 포함하지 않는 x1_insp_state 문자열은 참을 반환한다', () => {
  const x1_insp_value = 'x1_insp_state';

  const falsyx1_insp_value = isColumnNameNotIncludes_insp_value([
    { columnName: x1_insp_value },
  ]);

  expect(falsyx1_insp_value).toBe(true);
});

test('_insp_value를 포함하는 배열은 0개 이상의 요소를 반환한다', () => {
  const inspectionsItems = [
    {
      x1_insp_value: 1,
      x2_insp_value: 2,
      x1_insp_state: true,
      x2_insp_state: false,
      sample_cnt: 2,
    },
    {
      x1_insp_value: 1,
      x2_insp_value: 2,
      x3_insp_value: 3,
      x1_insp_state: true,
      x2_insp_state: false,
      x3_insp_state: false,
      sample_cnt: 3,
    },
  ];

  const extractedInspections =
    extract_insp_ItemEntriesAtCounts(inspectionsItems);

  expect(extractedInspections).toEqual([
    [
      ['x1_insp_value', 1],
      ['x2_insp_value', 2],
    ],
    [
      ['x1_insp_value', 1],
      ['x2_insp_value', 2],
      ['x3_insp_value', 3],
    ],
  ]);
});

test('null 혹은 빈 문자열인 샘플은 null을 반환한다', () => {
  const nullOrEmptySample = [
    ['x1_insp_value', null],
    ['x2_insp_value', ''],
  ];

  const nullAllocatedResults = checkSamples(nullOrEmptySample);

  expect(nullAllocatedResults).toEqual([null, null]);
});
