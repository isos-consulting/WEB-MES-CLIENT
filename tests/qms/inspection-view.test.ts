import { ColumnStore } from '~/constants/columns';
import { ENUM_WIDTH } from '~/enums';
import { createInspectionReportColumns } from '~/functions/qms/inspection';

test('검사 시료의 개수가 0개이면 [합격 여부, 판정, 비고] 배열만 반환한다', () => {
  const emptyArray = [];

  const inspectionColumns = createInspectionReportColumns(emptyArray, 0);

  expect(inspectionColumns).toEqual([
    {
      header: '합격여부',
      name: 'insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
  ]);
});

test('검사 시료의 개수가 1개이면 [공정 검사 컬럼, x1, x1_판정, 합격 여부, 판정, 비고] 배열을 반환한다', () => {
  const procInspectColumns = ColumnStore.PROC_INSP_RESULT_DETAIL_ITEM;

  const sampleConcatedColumns = createInspectionReportColumns(
    procInspectColumns,
    1,
  );

  expect(sampleConcatedColumns).toEqual([
    {
      header: '검사기준서 상세UUID',
      name: 'insp_detail_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형UUID',
      name: 'insp_item_type_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형명',
      name: 'insp_item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사항목UUID',
      name: 'insp_item_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목명',
      name: 'insp_item_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '상세검사내용',
      name: 'insp_item_desc',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
    {
      header: '검사 기준',
      name: 'spec_std',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '최소 값',
      name: 'spec_min',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '최대 값',
      name: 'spec_max',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사방법UUID',
      name: 'insp_method_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사방법명',
      name: 'insp_method_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사구UUID',
      name: 'insp_tool_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사구명',
      name: 'insp_tool_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '정렬',
      name: 'sortby',
      width: ENUM_WIDTH.S,
      filter: 'text',
      hidden: true,
    },
    {
      header: '시료 수량',
      name: 'sample_cnt',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사 주기',
      name: 'insp_cycle',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: 'x1_insp_result_detail_value_uuid',
      name: 'x1_insp_result_detail_value_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: 'x1_sample_no',
      name: 'x1_sample_no',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: 'x1',
      name: 'x1_insp_value',
      width: ENUM_WIDTH.L,
      filter: 'text',
      editable: true,
    },
    {
      header: 'x1_판정',
      name: 'x1_insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: 'x1_판정',
      name: 'x1_insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '합격여부',
      name: 'insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
  ]);
});
