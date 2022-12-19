import {
  extract_insp_ItemEntriesAtCounts,
  getInspectItems,
  getInspectResult,
  getInspectSamples,
  getSampleIndex,
  isColumnNamesNotEndWith_insp_value,
} from '~/components/pages/prd/work/proc-inspection/proc-inspection-service';

test('x1_insp_value 문자열은 거짓을 반환한다', () => {
  const x1_insp_value = 'x1_insp_value';

  const falsyx1_insp_value = isColumnNamesNotEndWith_insp_value([
    { columnName: x1_insp_value },
  ]);

  expect(falsyx1_insp_value).toBe(false);
});

test('마지막에 "_insp_value" 문자열을 포함하지 않는 x1_insp_state 문자열은 참을 반환한다', () => {
  const x1_insp_value = 'x1_insp_state';

  const falsyx1_insp_value = isColumnNamesNotEndWith_insp_value([
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
  const nullOrEmptySample: [string, any][][] = [
    [
      ['x1_insp_value', null],
      ['x2_insp_value', ''],
    ],
    [
      ['x1_insp_value', '1'],
      ['x2_insp_value', '2'],
      ['x3_insp_value', '3'],
    ],
  ];

  const nullAllocatedResults = getInspectSamples(nullOrEmptySample, [
    { min: null, max: null },
    { min: '1', max: '1' },
  ]);

  expect(nullAllocatedResults).toEqual([
    [null, null],
    [true, false, false],
  ]);
});

test('검사 항목의 시료 판정이 전부 null이면 검사 항목 판정은 null을 반환한다', () => {
  const nullableInspectionItemSamples = [[null, null, null]];

  const nullAllocatedResults = getInspectItems(nullableInspectionItemSamples);

  expect(nullAllocatedResults).toEqual([null]);
});

test('검사 항목의 시료 판정 중 하나라도 false이면 검사 항목 판정은 false를 반환한다', () => {
  const falsyIncludesInspectionItemSamples = [[true, false, null]];

  const falseAllocatedResults = getInspectItems(
    falsyIncludesInspectionItemSamples,
  );

  expect(falseAllocatedResults).toEqual([false]);
});

test('검사 항목의 시료 판정이 전부 true이면 검사 항목 판정은 true를 반환한다', () => {
  const truthyInspectionItemSamples = [[true, true, true]];

  const trueAllocatedResults = getInspectItems(truthyInspectionItemSamples);

  expect(trueAllocatedResults).toEqual([true]);
});

test('검사 항목 판정 중 하나라도 null이면 검사 판정은 null을 반환한다', () => {
  const nullableInspectionItems = [true, null, true];

  const nullAllocatedResults = getInspectResult(nullableInspectionItems);

  expect(nullAllocatedResults).toEqual(null);
});

test('검사 항목 판정 중 하나라도 false이면 검사 판정은 false를 반환한다', () => {
  const falsyIncludesInspectionItems = [true, false, true];

  const falseAllocatedResults = getInspectResult(falsyIncludesInspectionItems);

  expect(falseAllocatedResults).toEqual(false);
});

test('검사 항목 판정이 전부 true이면 검사 판정은 true를 반환한다', () => {
  const truthyInspectionItems = [true, true, true];

  const trueAllocatedResults = getInspectResult(truthyInspectionItems);

  expect(trueAllocatedResults).toEqual(true);
});

test('검사 시료 x1_insp_value의 인덱스는 0을 반환한다', () => {
  const zeroIndexSample = 'x1_insp_value';

  const zeroIndex = getSampleIndex(zeroIndexSample);

  expect(zeroIndex).toEqual(0);
});
