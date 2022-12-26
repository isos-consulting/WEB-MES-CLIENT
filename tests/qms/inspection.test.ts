import {
  extract_insp_ItemEntriesAtCounts,
  getDateFormat,
  getDateTimeFormat,
  getInspectItems,
  getInspectResult,
  getInspectResultText,
  getInspectSamples,
  getInspectTool,
  getMissingValueInspectResult,
  getRangeNumberResults,
  getSampleIndex,
  getTimeFormat,
  isColumnNamesNotEndWith_insp_value,
} from '~/functions/qms/inspection';

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

test('검사 결과가 null이면 검사 결과 텍스트는 null을 반환한다', () => {
  const nullResult = null;

  const nullResultText = getInspectResultText(nullResult);

  expect(nullResultText).toEqual(null);
});

test('검사 결과가 true이면 검사 결과 텍스트는 "합격"을 반환한다', () => {
  const trueResult = true;

  const trueResultText = getInspectResultText(trueResult);

  expect(trueResultText).toEqual('합격');
});

test('검사 결과가 false이면 검사 결과 텍스트는 "불합격"을 반환한다', () => {
  const falseResult = false;

  const falseResultText = getInspectResultText(falseResult);

  expect(falseResultText).toEqual('불합격');
});

test('검사 범위의 최소값과 최대값이 전부 숫자가 아니면 육안 검사 도구를 반환한다', () => {
  const nonNumericRange = getRangeNumberResults({ min: 'x', max: 'a' });
  console.log({ nonNumericRange });

  const nonNumericRangeTool = getInspectTool(nonNumericRange);

  expect(nonNumericRangeTool).toEqual('string');
});

test('생성일자는 YYYY-MM-DD 형식의 문자열이다', () => {
  const date = new Date().toString();

  const dateText = getDateFormat(date);

  expect(dateText).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test('시간은 HH:mm:ss 형식의 문자열이다', () => {
  const time = new Date().toString();

  const timeText = getTimeFormat(time);

  expect(timeText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
});

test('일시는 YYYY-MM-DD HH:mm:ss 형식의 문자열이다', () => {
  const datetime = new Date().toString();

  const datetimeText = getDateTimeFormat(datetime);

  expect(datetimeText).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
});

test('0번쨰 시료 결과 값이 null이면 결측치 검사는 true를 반환한다', () => {
  const nullSample = [null, true, false];

  const nullSampleResult = getMissingValueInspectResult(nullSample);

  expect(nullSampleResult).toEqual(true);
});

test('0번째와 2번째 시료는 결과 값이 있지만 1번째 시료에 결과 값이 null이면 결측치 검사는 true를 반환한다', () => {
  const nullSample = [true, null, false];

  const nullSampleResult = getMissingValueInspectResult(nullSample);

  expect(nullSampleResult).toEqual(true);
});

test('시료 결과 값이 전부 입력되어 있으면 결측치 검사는 false를 반환한다', () => {
  const allInputSample = [true, true, true];

  const allInputSampleResult = getMissingValueInspectResult(allInputSample);

  expect(allInputSampleResult).toEqual(false);
});
