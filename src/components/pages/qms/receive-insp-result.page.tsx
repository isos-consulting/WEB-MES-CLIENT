import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Space, Typography, Modal, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  IGridColumn,
  ISearchItem,
  Searchbox,
} from '~/components/UI';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import {
  executeData,
  getData,
  getPageName,
  getPermissions,
  getToday,
} from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_ADM } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { cloneDeep } from 'lodash';
import {
  URI_PATH_DELETE_QMS_RECEIVE_INSP_RESULT,
  URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS,
  URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS,
} from './receive-insp-result/modals/constants';
import { INSP_RESULT_CREATE_POPUP } from './receive-insp-result/modals/insert.modal';
import {
  TReceiveInspDetail,
  TReceiveInspHeader,
} from './receive-insp-result/modals/types';
import { INSP_RESULT_EDIT_POPUP } from './receive-insp-result/modals/edit.modal';

dayjs.locale('ko-kr');
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export const PgQmsReceiveInspResult = () => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();
  const [workDatas, setWorkDatas] = useState([]);
  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();
  const [inspResultUuid, setInspResultUuid] = useState('');
  const [inspDetailType, setInspDetailType] = useState([]);
  const [createPopupVisible, setCreatePopupVisible] = useState(false);
  const [inspHandlingType, setInspHandlingType] = useState([]);

  const INPUT_ITEMS_RECIEVE: IInputGroupboxItem[] = [
    { id: 'partner_nm', label: '거래처', type: 'text', disabled: true },
    { id: 'receive_date', label: '입하일', type: 'date', disabled: true },
    { id: 'receive_type', label: '입하구분', type: 'text', disabled: true },
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
    { id: 'receive_qty', label: '입하수량', type: 'number', disabled: true },
  ];

  const inputReceive = useInputGroup('INPUT_ITEMS_WORK', INPUT_ITEMS_RECIEVE);

  const SEARCH_ITEMS: ISearchItem[] = [
    { type: 'date', id: 'start_date', label: '검사일', default: getToday(-7) },
    { type: 'date', id: 'end_date', default: getToday() },
    {
      type: 'combo',
      id: 'insp_detail_type',
      firstItemType: 'all',
      default: 'all',
      options: inspDetailType,
    },
  ];

  const COLUMNS: IGridColumn[] = [
    {
      header: '성적서UUID',
      name: 'insp_result_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.S,
      filter: 'text',
      align: 'center',
    },
    {
      header: '세부검사유형코드',
      name: 'insp_detail_type_cd',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '세부검사유형',
      name: 'insp_detail_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '처리결과',
      name: 'insp_handling_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '세부입하UUID',
      name: 'receive_detail_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.L,
      hidden: true,
    },
    {
      header: '거래처명',
      name: 'partner_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '입하일자',
      name: 'receive_date',
      format: 'date',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '품목유형명',
      name: 'item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '제품유형명',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '품목명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
    { header: '모델명', name: 'model_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '단위명', name: 'unit_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '검사 수량',
      name: 'insp_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '합격 수량',
      name: 'pass_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '부적합 창고UUID',
      name: 'reject_store_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합 창고',
      name: 'reject_store_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '부적합 위치UUID',
      name: 'reject_location_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합 위치',
      name: 'reject_location_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.XL, filter: 'text' },
    {
      header: '바코드',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
      hidden: true,
    },
  ];

  const onSearch = () => {
    const { values } = searchRef?.current;
    const searchParams = cloneDeep(values);
    if (searchParams.insp_detail_type !== 'all') {
      searchParams.insp_detail_type_uuid = searchParams.insp_detail_type;
    }
    delete searchParams.insp_detail_type;
    getData(searchParams, URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS).then(res => {
      setWorkDatas(res || []);
      inputReceive.ref.current.resetForm();
      setInspResultUuid('');
    });
  };

  const onCreate = ev => {
    setCreatePopupVisible(true);
  };

  useLayoutEffect(() => {
    const _inspDetailType: object[] = [];
    getData(
      { insp_type_cd: 'RECEIVE_INSP' },
      URL_PATH_ADM.INSP_DETAIL_TYPE.GET.INSP_DETAIL_TYPES,
      'raws',
    ).then(async res => {
      res.map(item => {
        _inspDetailType.push({
          code: item.insp_detail_type_uuid,
          text: item.insp_detail_type_nm,
        });
      });
      setInspDetailType(_inspDetailType);
    });

    const _inspHandlingType: object[] = [];
    getData(
      {},
      URL_PATH_ADM.INSP_HANDLING_TYPE.GET.INSP_HANDLING_TYPES,
      'raws',
    ).then(async res => {
      res.map(item => {
        _inspHandlingType.push({
          code: JSON.stringify({
            insp_handling_type_uuid: item.insp_handling_type_uuid,
            insp_handling_type_cd: item.insp_handling_type_cd,
          }),
          text: item.insp_handling_type_nm,
        });
      });
      setInspHandlingType(_inspHandlingType);
    });
  }, []);

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        수입검사 이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right', marginTop: -70 }}>
            <Button
              btnType="buttonFill"
              widthSize="auto"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onCreate}
              disabled={!permissions?.create_fg}
            >
              신규 추가
            </Button>
          </Space>
        </div>
        <div style={{ maxWidth: 700, marginTop: -20, marginLeft: -6 }}>
          <Searchbox
            id="receive_insp_result_search"
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <Datagrid
          gridId={'RECEIVE_GRID'}
          ref={gridRef}
          gridMode={'select'}
          columns={COLUMNS}
          height={300}
          data={workDatas}
          onAfterClick={ev => {
            const { rowKey, targetType } = ev;

            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];
                inputReceive.setValues({
                  ...row,
                  receive_type: row?.insp_detail_type_nm,
                  receive_qty: row?.insp_qty,
                });
                setInspResultUuid(row?.insp_result_uuid);
              } catch (e) {
                console.log(e);
              } finally {
              }
            }
          }}
        />
      </Container>
      <Row gutter={[16, 0]}>
        <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            입하정보
          </Typography.Title>
          <div
            style={{ width: '100%', display: 'inline-block', marginTop: -26 }}
          >
            {' '}
          </div>
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <InputGroupbox {...inputReceive.props} />
          </Row>
        </Col>
      </Row>
      <Typography.Title
        level={5}
        style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
      >
        <CaretRightOutlined />
        검사정보
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <INSP_RESULT_DETAIL_GRID
        inspHandlingType={inspHandlingType}
        inspResultUuid={inspResultUuid}
        onSearchResults={onSearch}
      />
      {createPopupVisible ? (
        <INSP_RESULT_CREATE_POPUP
          inspHandlingType={inspHandlingType}
          popupVisible={createPopupVisible}
          setPopupVisible={setCreatePopupVisible}
          onAfterCloseSearch={onSearch}
        />
      ) : null}

      {contextHolder}
    </>
  );
};

const INSP_RESULT_DETAIL_GRID = (props: {
  inspResultUuid: string;
  inspHandlingType: any;
  onSearchResults: () => void;
}) => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const gridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [receiveInspHeaderData, setReceiveInspHeaderData] =
    useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<
    TReceiveInspDetail[]
  >([]);

  const INSP_DETAIL_COLUMNS: IGridColumn[] = [
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
  ];

  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
    let items: IGridColumn[] = INSP_DETAIL_COLUMNS;

    if (receiveInspHeaderData?.max_sample_cnt > 0) {
      for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
        items.push({
          header: 'x' + i + '_insp_result_detail_value_uuid',
          name: 'x' + i + '_insp_result_detail_value_uuid',
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_sample_no',
          name: 'x' + i + '_sample_no',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i,
          name: 'x' + i + '_insp_value',
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_fg',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_state',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    items.push({
      header: '합격여부',
      name: 'insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    });
    items.push({
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
    });
    items.push({
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    });

    return items;
  }, [receiveInspHeaderData]);

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    {
      id: 'reg_date',
      label: '검사일',
      type: 'date',
      disabled: true,
      required: true,
    },
    {
      id: 'reg_date_time',
      label: '검사시간',
      type: 'time',
      disabled: true,
      required: true,
    },
    {
      id: 'emp_nm',
      label: '검사자',
      type: 'text',
      disabled: true,
      required: true,
    },
    {
      id: 'insp_handling_type_nm',
      label: '처리결과',
      type: 'text',
      disabled: true,
    },
    { id: 'remark', label: '비고', type: 'text', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    { id: 'pass_qty', label: '입고수량', type: 'number', disabled: true },
    { id: 'to_store_nm', label: '입고창고', type: 'text', disabled: true },
    { id: 'to_location_nm', label: '입고위치', type: 'text', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
    { id: 'reject_qty', label: '부적합수량', type: 'number', disabled: true },
    { id: 'reject_nm', label: '불량유형', type: 'text', disabled: true },
    { id: 'reject_store_nm', label: '반출창고', type: 'text', disabled: true },
    {
      id: 'reject_location_nm',
      label: '반출위치',
      type: 'text',
      disabled: true,
    },
  ];

  const inputInspResult = useInputGroup(
    'INPUT_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: '부적합정보' },
  );

  const onEdit = ev => {
    if (!props.inspResultUuid) {
      message.warning('수정 할 성적서를 선택 후 수정기능을 이용해주세요.');
      return;
    }
    setEditPopupVisible(true);
  };

  const onDelete = async ev => {
    if (!props.inspResultUuid) {
      message.warn('삭제 할 성적서를 선택 후 다시 시도해주세요..');
      return;
    }

    Modal.confirm({
      icon: null,
      title: '삭제',
      content: '성적서를 삭제하시겠습니까?',
      onOk: async () => {
        await executeData(
          [
            {
              uuid: props.inspResultUuid,
              insp_detail_type_uuid: (receiveInspHeaderData as any)
                ?.insp_detail_type_uuid,
            },
          ],
          URI_PATH_DELETE_QMS_RECEIVE_INSP_RESULT,
          'delete',
          'success',
        )
          .then(value => {
            if (!value) return;
            onClear();
            props.onSearchResults();
            message.info('저장되었습니다.');
          })
          .catch(e => {
            console.log(e);
          });
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });
  };

  const onClear = () => {
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

  const onSesrchInspResultDetail = insp_result_uuid => {
    const searchUriPath =
      URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS.replace(
        '{uuid}',
        insp_result_uuid,
      );
    getData({}, searchUriPath, 'header-details')
      .then((res: any) => {
        setReceiveInspHeaderData(res.header);
        setReceiveInspDetailData(res.details);
        inputInspResult.setValues({
          ...res.header,
          reg_date_time: res.header.reg_date,
        });
        inputInspResultIncome.setValues({
          ...res.header,
          qty: res.header.pass_qty,
        });
        inputInspResultReject.setValues({ ...res.header });
      })
      .catch(err => {
        onClear();
        message.error('에러');
      });
  };

  useLayoutEffect(() => {
    if (props.inspResultUuid) {
      onSesrchInspResultDetail(props.inspResultUuid);
    } else {
      onClear();
    }
  }, [props.inspResultUuid]);

  return (
    <>
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right', marginTop: -70 }}>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onEdit}
              disabled={!permissions?.update_fg}
            >
              수정
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType="red"
              onClick={onDelete}
              disabled={!permissions?.delete_fg}
            >
              삭제
            </Button>
          </Space>
        </div>
        <Row
          gutter={[16, 0]}
          style={{ minHeight: 550, maxHeight: 700, marginTop: -15 }}
        >
          <Col
            span={24}
            style={{ minHeight: 550, maxHeight: 700, overflow: 'auto' }}
          >
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
            <InputGroupbox boxShadow={false} {...inputInspResultIncome.props} />
            <InputGroupbox boxShadow={false} {...inputInspResultReject.props} />
            <p />
            <Datagrid
              height={250}
              gridId={'DETAIL_GRID'}
              ref={gridRef}
              gridMode={'view'}
              columns={CREATE_POPUP_DETAIL_COLUMNS}
              data={receiveInspDetailData}
            />
          </Col>
        </Row>
      </Container>
      {editPopupVisible ? (
        <INSP_RESULT_EDIT_POPUP
          inspHandlingType={props.inspHandlingType}
          inspResultUuid={props.inspResultUuid}
          popupVisible={editPopupVisible}
          setPopupVisible={setEditPopupVisible}
          onAfterCloseSearch={onSesrchInspResultDetail}
        />
      ) : null}
    </>
  );
};
