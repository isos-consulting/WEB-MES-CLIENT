import { isColumnNameNotIncludes_insp_value } from '~/components/pages/prd/work/proc-inspection/proc-inspection-service';

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
