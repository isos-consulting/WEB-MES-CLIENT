import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, message, Space, Typography, Modal, Row, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  IGridColumn,
  TGridMode,
} from '~/components/UI';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import { Modal as CustomModal } from '~/components/UI';
import {
  executeData,
  getData,
  getPageName,
  getPermissions,
  getToday,
} from '~/functions';
import Colors from '~styles/color.style.scss';
import { onDefaultGridSave, onErrorMessage, TAB_CODE } from './work.page.util';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import _, { cloneDeep } from 'lodash';
import { selector } from 'recoil';

//#region 🔶🚫투입품목관리
/** 투입품목관리 */

// URI PATH 설정
const URI_PATH_STANDARD_INPUT_WORK = '/prd/work-inputs/group';
const URI_PATH_WORK_INPUT = '/prd/work-inputs';
const URI_PATH_SAVE_INPUT = '/prd/work-inputs';

export const INPUT = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();
  const gridRef = useRef<Grid>();

  const [gridMode, setGridMode] = useState<TGridMode>('view');

  const [data, setData] = useState([]);

  const [parentParams, setParentParams] = useState({});
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});

  const SEARCH_URI_PATH = '/prd/work-inputs';
  const GOING_SEARCH_URI_PATH = '/prd/work-inputs/group';
  const SAVE_URI_PATH = '/prd/work-inputs';

  const [inputPopupVisible, setInputPopupVisible] = useState(false);
  //#endregion

  //#region ✅컬럼
  const INPUT_COLUMNS: IGridColumn[] = [
    {
      header: '투입이력UUID',
      name: 'work_input_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.M },
    { header: '품목', name: 'prod_nm', width: ENUM_WIDTH.M },
    {
      header: '품목 유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목 유형코드',
      name: 'item_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '품목 유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '제품 유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '제품 유형코드',
      name: 'prod_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '제품 유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '모델코드',
      name: 'model_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, noSave: true },
    { header: '리비전', name: 'rev', width: ENUM_WIDTH.M },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '단위코드',
      name: 'unit_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.M, noSave: true },
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, editable: true },
    {
      header: '투입 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      editable: true,
    },
    {
      header: '실적기준 투입필요 수량',
      name: 'required_work_qty',
      width: ENUM_WIDTH.L,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    { header: '소요량', name: 'c_usage', width: ENUM_WIDTH.M },
    {
      header: '출고 창고UUID',
      name: 'from_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고 창고코드',
      name: 'from_store_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '출고 창고',
      name: 'from_store_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '출고 위치UUID',
      name: 'from_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고 위치코드',
      name: 'from_location_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '출고 위치',
      name: 'from_location_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '투입유형UUID',
      name: 'bom_input_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '투입유형코드',
      name: 'bom_input_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '투입유형',
      name: 'bom_input_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.M, noSave: true },
  ];
  //#endregion

  //#region 🚫함수
  const onSearch = () => {
    let uriPath = SEARCH_URI_PATH;

    if ((searchParams as any)?.complete_fg === 'false') {
      //실적 데이터가 진행중인 항목인 경우
      uriPath = GOING_SEARCH_URI_PATH;
    }

    const work_uuid = (searchParams as any)?.work_uuid;

    getData(
      { work_uuid },
      uriPath,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      setData(res);
    });
  };

  /** 투입 초기화 */
  const onReset = ev => {
    if (searchParams?.['work_uuid'] == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (searchParams?.['complete_fg'] === true) {
      message.info('완료된 작업은 투입이력을 초기화 할 수 없습니다.');
      return;
    }

    modal.confirm({
      title: '투입이력 초기화',
      content: '투입이력을 초기화 하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        // 투입이력 초기화
        let errorChk = false;
        const work_uuid = (searchParams as any)?.work_uuid;
        executeData(
          { work_uuid },
          '/prd/work-inputs/by-work',
          'delete',
          'success',
        )
          .then(success => {
            if (!success) {
              errorChk = true;
            }
          })
          .catch(e => (errorChk = true))
          .finally(() => {
            if (errorChk) {
              message.error('투입 이력 초기화 실패');
            } else {
              message.info('투입 이력이 정상적으로 초기화 되었습니다.');
            }

            onSearch();
          });
      },
    });
  };

  const onAppend = ev => {
    if (searchParams?.['work_uuid'] == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (searchParams?.['complete_fg'] === true) {
      onErrorMessage('완료된작업시도');
      return;
    }

    //투입등록하는 팝업 호출
    setInputPopupVisible(true);
  };

  const inputColumns = cloneDeep(INPUT_COLUMNS)?.filter(
    el => el?.name !== 'lot_no',
  );

  //#region 🚫렌더부
  const component = (
    <>
      <Container boxShadow={false}>
        {gridMode === 'view' ? (
          <div style={{ width: '100%', display: 'inline-block' }}>
            <Space size={[6, 0]} style={{ float: 'right' }}>
              <Button
                btnType="buttonFill"
                widthSize="large"
                heightSize="small"
                fontSize="small"
                ImageType="delete"
                colorType="gray"
                onClick={onReset}
                disabled={!permissions?.delete_fg}
              >
                투입 초기화
              </Button>
              {/* <Button btnType='buttonFill' widthSize='small' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete}>삭제</Button>
              <Button btnType='buttonFill' widthSize='small' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit}>수정</Button> */}
              <Button
                btnType="buttonFill"
                widthSize="medium"
                heightSize="small"
                fontSize="small"
                ImageType="add"
                colorType="blue"
                onClick={onAppend}
                disabled={
                  !(
                    permissions?.create_fg ||
                    permissions?.update_fg ||
                    permissions?.delete_fg
                  )
                }
              >
                투입
              </Button>
            </Space>
          </div>
        ) : null}
        <p />
        <Datagrid
          gridId={TAB_CODE.workInput + '_GRID'}
          ref={gridRef}
          gridMode={gridMode}
          columns={inputColumns}
          data={data}
          height={420}
          disabledAutoDateColumn={true}
        />
      </Container>
      {inputPopupVisible ? (
        <INPUT_POPUP
          visible={inputPopupVisible}
          // oldGridData={data}
          columns={INPUT_COLUMNS}
          searchParams={{
            work_uuid: (searchParams as any)?.work_uuid,
            complete_fg: (searchParams as any)?.complete_fg,
            order_qty: (searchParams as any)?.order_qty,
          }}
          setVisible={setInputPopupVisible}
        />
      ) : null}

      {contextHolder}
    </>
  );
  //#endregion

  return {
    component,

    gridRef,

    gridMode,
    setGridMode,

    data,
    setData,

    searchParams,
    setSearchParams,

    saveOptionParams,
    setSaveOptionParams,

    parentParams,
    setParentParams,

    onSearch,

    SEARCH_URI_PATH,
    GOING_SEARCH_URI_PATH,
  };
};
//#endregion

/** 투입등록하는 팝업 */
export const INPUT_POPUP = (props: {
  // 전달 받을 변수
  visible: boolean;
  // oldGridData:any,
  columns: IGridColumn[];
  searchParams: {
    work_uuid?: string;
    complete_fg?: boolean;
    order_qty?: number;
  };

  // 전달 받을 함수
  setVisible: (value?) => void;
}) => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region 🚫설정값
  const [modal, contextHolder] = Modal.useModal();

  // 신규 투입 그리드 관련 설정값
  const inputRefStandardInput = useRef<FormikProps<FormikValues>>();
  const gridRefStandardInput = useRef<Grid>();
  const gridRefWorkInput = useRef<Grid>();

  const gridRefWorkInputUpdate = useRef<Grid>();

  // ** STATE 관리
  const [standardInputData, setStandardInputData] = useState([]); //상단 실적기준 투입 그리드 데이터
  const [inputData, setInputData] = useState([]); // 하단 투입 실적 그리드 데이터

  const [inputCreatePopupVisible, setInputCreatePopupVisible] = useState(false);
  const [inputUpdatePopupVisible, setInputUpdatePopupVisible] = useState(false);
  const [inputInfo, setInputInfo] = useState({});

  const workInputGridMode = useMemo(() => {
    if (permissions?.delete_fg !== true) {
      return 'view';
    } else return 'delete';
  }, [permissions]);

  const [searchParams, setSearchParams] = useState(props.searchParams || {});
  //#endregion

  //#region 🚫사이드 이펙트

  // 조회조건 변경되면 신규 데이터 그리드 데이터 리로드
  useLayoutEffect(() => {
    setSearchParams(curr =>
      curr != props.searchParams ? props.searchParams : curr,
    );
  }, [props.searchParams]);

  useLayoutEffect(() => {
    if (searchParams?.work_uuid == null) return;
    onWorkStandardInputData_Search();
    onWorkInputData_Search();
  }, [searchParams?.['work_uuid']]);

  useLayoutEffect(() => {
    if (searchParams?.work_uuid == null) return;
    if (!inputCreatePopupVisible) {
      onWorkStandardInputData_Search();
      onWorkInputData_Search();
    }
  }, [inputCreatePopupVisible]);

  useLayoutEffect(() => {
    if (searchParams?.work_uuid == null) return;
    if (!inputUpdatePopupVisible) {
      onWorkStandardInputData_Search();
      onWorkInputData_Search();
    }
  }, [inputUpdatePopupVisible]);
  //#endregion

  //#region ✅컬럼
  const NEW_GRID_INPUT_ITEMS: IInputGroupboxItem[] = [
    { id: 'reg_date', type: 'date', default: getToday(), label: '기준일' },
  ];

  const onSetInputInfo = async inputInfo => {
    setInputInfo(inputInfo);
  };

  const NEW_GRID_COLUMNS: IGridColumn[] = [
    {
      header: '구분',
      name: '_work_input_btn',
      width: 80,
      hidden: false,
      format: 'button',
      options: {
        value: '투입',
        onClick: (ev, props) => {
          const selectRow = props.grid.getRow(props.rowKey);
          if (selectRow.bom_input_type_cd === 'PULL') {
            message.error(
              '선입선출 항목입니다. 선입선출 항목은 투입이 불가능합니다.',
            );
          } else {
            onSetInputInfo(props).then(() => {
              setInputCreatePopupVisible(true);
            });
          }
        },
        disabled: !permissions?.create_fg,
      },
    },
    {
      header: '투입이력UUID',
      name: 'work_input_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.M },
    { header: '품목', name: 'prod_nm', width: ENUM_WIDTH.M },
    {
      header: '품목 유형UUID',
      name: 'item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '품목 유형코드',
      name: 'item_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '품목 유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '제품 유형UUID',
      name: 'prod_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '제품 유형코드',
      name: 'prod_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '제품 유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '모델UUID',
      name: 'model_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '모델코드',
      name: 'model_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    { header: '모델', name: 'model_nm', width: ENUM_WIDTH.M, noSave: true },
    { header: '리비전', name: 'rev', width: ENUM_WIDTH.M },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.M },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '단위코드',
      name: 'unit_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    { header: '단위', name: 'unit_nm', width: ENUM_WIDTH.M, noSave: true },
    {
      header: '투입 수량',
      name: 'qty',
      width: ENUM_WIDTH.M,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '실적기준 투입필요 수량',
      name: 'required_work_qty',
      width: ENUM_WIDTH.L,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    { header: '소요량', name: 'c_usage', width: ENUM_WIDTH.M },
    {
      header: '출고 창고UUID',
      name: 'from_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고 창고코드',
      name: 'from_store_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '출고 창고',
      name: 'from_store_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '출고 위치UUID',
      name: 'from_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '출고 위치코드',
      name: 'from_location_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '출고 위치',
      name: 'from_location_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    {
      header: '투입유형UUID',
      name: 'bom_input_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '투입유형코드',
      name: 'bom_input_type_cd',
      width: ENUM_WIDTH.M,
      hidden: true,
      noSave: true,
    },
    {
      header: '투입유형',
      name: 'bom_input_type_nm',
      width: ENUM_WIDTH.M,
      noSave: true,
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.M, noSave: true },
  ];

  //#endregion

  //#region 🚫함수
  /** 신규 데이터 조회 함수 (초기화용) */
  const onWorkStandardInputData_Search = () => {
    const work_uuid = props.searchParams?.['work_uuid'];

    getData(
      { work_uuid },
      URI_PATH_STANDARD_INPUT_WORK,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      setStandardInputData(res);
    });
    // setNewData([]);
  };

  /** 기존 데이터 조회 함수 */
  const onWorkInputData_Search = () => {
    const work_uuid = props.searchParams?.['work_uuid'];

    getData(
      { work_uuid },
      URI_PATH_WORK_INPUT,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      setInputData(res);
    });
  };

  /** 투입 초기화 */
  const onReset = ev => {
    modal.confirm({
      title: '투입이력 초기화',
      content: '투입이력을 초기화 하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => {
        // 투입이력 초기화
        let errorChk = false;
        const work_uuid = props.searchParams?.['work_uuid'];
        executeData(
          { work_uuid },
          '/prd/work-inputs/by-work',
          'delete',
          'success',
        )
          .then(success => {
            if (!success) {
              errorChk = true;
            }
          })
          .catch(e => (errorChk = true))
          .finally(() => {
            if (errorChk) {
              message.error('투입 이력 초기화 실패');
            } else {
              message.info('투입 이력이 정상적으로 초기화 되었습니다.');
            }
            onWorkStandardInputData_Search();
            onWorkInputData_Search();
          });
      },
    });
  };

  /** 기존 데이터 삭제 이력 저장 함수 */
  const onDelete = ev => {
    onDefaultGridSave(
      'basic',
      gridRefWorkInput,
      props.columns,
      URI_PATH_SAVE_INPUT,
      {},
      modal,
      () => {
        onWorkStandardInputData_Search();
        onWorkInputData_Search();
      },
    );
  };

  //#endregion

  //#region 🚫렌더부
  if (props.visible) {
    return !permissions ? (
      <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
    ) : (
      <CustomModal
        title="투입품목등록"
        visible={true}
        width="80%"
        onCancel={() => props.setVisible(false)}
        okButtonProps={{ hidden: true }}
      >
        <div>
          <Row gutter={[0, 16]}>
            <Typography.Title
              level={5}
              style={{ marginBottom: -16, color: Colors.palettes_primary }}
            >
              <CaretRightOutlined />
              신규 투입
            </Typography.Title>
            <Divider style={{ marginBottom: 10 }} />
            <div>
              <InputGroupbox
                id="투입품목등록_입력상자"
                innerRef={inputRefStandardInput}
                inputItems={NEW_GRID_INPUT_ITEMS}
                boxShadow={false}
              />
            </div>
            <Container boxShadow={false}>
              <Datagrid
                gridId="투입품목등록_신규투입_그리드"
                ref={gridRefStandardInput}
                columns={NEW_GRID_COLUMNS}
                data={standardInputData}
                gridMode={'view'}
                height={300}
                hiddenActionButtons={true}
                disabledAutoDateColumn={true}
              />
            </Container>

            <Typography.Title level={5} style={{ marginBottom: -16 }}>
              <CaretRightOutlined />
              수정 / 삭제
            </Typography.Title>
            <Divider style={{ marginBottom: 10 }} />
            <div style={{ width: '100%', display: 'inline-block' }}>
              <Space size={[6, 0]} style={{ float: 'right' }}>
                <Button
                  btnType="buttonFill"
                  widthSize="large"
                  heightSize="small"
                  fontSize="small"
                  ImageType="delete"
                  colorType="gray"
                  onClick={onReset}
                  disabled={!permissions?.delete_fg}
                >
                  투입 초기화
                </Button>
                <Button
                  btnType="buttonFill"
                  widthSize="medium"
                  heightSize="small"
                  fontSize="small"
                  ImageType="delete"
                  colorType="blue"
                  onClick={onDelete}
                  disabled={!permissions?.delete_fg}
                >
                  삭제
                </Button>
                <Button
                  btnType="buttonFill"
                  widthSize="medium"
                  heightSize="small"
                  fontSize="small"
                  ImageType="edit"
                  colorType="blue"
                  onClick={() => setInputUpdatePopupVisible(true)}
                  disabled={!permissions?.update_fg}
                >
                  수정
                </Button>
              </Space>
            </div>
            <Container boxShadow={false}>
              <Datagrid
                gridId="투입품목등록_투입이력_그리드"
                ref={gridRefWorkInput}
                columns={props.columns}
                data={inputData}
                // gridMode={permissions?.delete_fg ? 'delete' : 'view'}
                gridMode={workInputGridMode}
                disabledAutoDateColumn={true}
              />
            </Container>
          </Row>
          {setInputCreatePopupVisible ? (
            <INPUT_POPUP_CREATE
              searchParams={{
                regDate: inputRefStandardInput.current?.values?.reg_date,
                workUuid: props.searchParams.work_uuid,
                inputInfo: inputInfo,
              }}
              visible={inputCreatePopupVisible}
              setVisible={setInputCreatePopupVisible}
            />
          ) : null}
          {inputUpdatePopupVisible ? (
            <GridPopup
              popupId={'투입이력_수정_그리드'}
              defaultVisible={false}
              title={'투입이력 - 항목 수정'}
              visible={inputUpdatePopupVisible}
              okText="수정하기"
              cancelText="취소"
              onAfterOk={(isSuccess, savedData) => {
                if (!isSuccess) return;
                setInputUpdatePopupVisible(false);
              }}
              onCancel={() => setInputUpdatePopupVisible(false)}
              ref={gridRefWorkInputUpdate}
              parentGridRef={gridRefWorkInput}
              gridId={'투입품목등록_투입이력_수정_그리드'}
              gridMode="update"
              data={inputData}
              columns={props.columns}
              saveType={'basic'}
              saveUriPath={URI_PATH_SAVE_INPUT}
              searchUriPath={''}
              searchProps={null}
              inputProps={null}
              disabledAutoDateColumn={true}
            />
          ) : null}
          {contextHolder}
        </div>
      </CustomModal>
    );
  } else return null;
  //#endregion
};
//#endregion

// 신규 투입
export const INPUT_POPUP_CREATE = (props: {
  // 전달 받을 변수
  visible: boolean;
  searchParams?: {
    regDate?: string;
    workUuid?: string;
    inputInfo?: object;
  };
  setVisible: (value?) => void;
}) => {
  const [modal, contextHolder] = Modal.useModal();

  const { rowKey, grid } = props.searchParams?.inputInfo as any;
  const rowData = grid?.store?.data?.rawData[rowKey];

  //#region 🚫설정값

  // 신규 투입 그리드 관련 설정값
  const inputRefStandardInput = useRef<FormikProps<FormikValues>>();
  const gridRefWorkInput = useRef<Grid>();

  //#region ✅입력상자
  const INPUT_ITEMS: IInputGroupboxItem[] = [
    {
      id: 'reg_date',
      label: '기준일',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    {
      id: 'prod_uuid',
      label: '품목uuid',
      type: 'text',
      hidden: true,
      disabled: true,
    },
    {
      id: 'prod_no',
      label: '품번',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    {
      id: 'prod_nm',
      label: '품명',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    {
      id: 'item_type_nm',
      label: '품목유형',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    {
      id: 'prod_type_nm',
      label: '제품유형',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    { id: 'rev', label: 'Rev', type: 'text', hidden: false, disabled: true },
    {
      id: 'prod_std',
      label: '규격',
      type: 'text',
      hidden: false,
      disabled: true,
    },
    {
      id: 'unit_uuid',
      label: '단위UUID',
      type: 'text',
      hidden: true,
      disabled: true,
      required: true,
    },
    {
      id: 'unit_nm',
      label: '단위',
      type: 'text',
      hidden: false,
      disabled: true,
      required: true,
    },
    {
      id: 'bom_input_type_uuid',
      label: 'BOM 투입유형UUID',
      type: 'text',
      hidden: true,
      disabled: true,
      required: true,
    },
    {
      id: 'bom_input_type_nm',
      label: 'BOM 투입유형',
      type: 'text',
      hidden: false,
      disabled: true,
      required: true,
    },
    {
      id: 'c_usage',
      label: '소요량',
      type: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      disabled: true,
      hidden: true,
      required: true,
    },
    {
      id: 'qty',
      label: '이전투입량',
      type: 'number',
      decimal: ENUM_DECIMAL.DEC_USE_STOCK,
      disabled: true,
    },
    {
      id: 'required_work_qty',
      label: '실적기준투입량',
      type: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      disabled: true,
    },
    {
      id: 'from_store_uuid',
      label: '기준창고UUID',
      type: 'text',
      disabled: true,
      hidden: true,
      required: true,
    },
    {
      id: 'from_store_nm',
      label: '기준창고',
      type: 'text',
      disabled: true,
      hidden: false,
      required: true,
    },
    {
      id: 'from_location_uuid',
      label: '기준위치UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'from_location_nm',
      label: '기준위치',
      type: 'text',
      disabled: true,
      hidden: false,
    },
  ];

  const INPUT_GRID_ITEMS: IGridColumn[] = [
    // {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text'},
    // {header:'품목 유형', name:'item_type_nm', width:100, format:'text'},
    // {header:'제품 유형', name:'prod_type_nm', width:100, format:'text'},
    // {header:'품번', name:'prod_no', width:120, format:'text'},
    // {header:'품목', name:'prod_nm', width:120, format:'text', requiredField:true},
    // {header:'모델', name:'model_nm', width:120, format:'text'},
    // {header:'Rev', name:'rev', width:100, format:'text'},
    // {header:'규격', name:'prod_std', width:120, format:'text'},
    // {header:'단위UUID', name:'unit_uuid', width:80, hidden:true, format:'text'},
    // {header:'단위', name:'unit_nm', width:80, format:'text', requiredField:true},
    // {header:'투입방법UUID', name:'bom_input_type_uuid', width:120, hidden:true, format:'text'},
    // {header:'투입방법', name:'bom_input_type_nm', width:120, format:'popup', editable:true, requiredField:true},
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.L, format: 'text' },
    {
      header: '재고',
      name: 'stock_qty',
      width: ENUM_WIDTH.L,
      format: 'number',
      noSave: true,
    },
    {
      header: '투입수량',
      name: 'qty',
      width: ENUM_WIDTH.XL,
      format: 'number',
      editable: true,
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '창고UUID',
      name: 'store_uuid',
      alias: 'from_store_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      format: 'text',
    },
    {
      header: '창고',
      name: 'store_nm',
      width: ENUM_WIDTH.L,
      format: 'text',
      requiredField: true,
    },
    {
      header: '위치UUID',
      name: 'location_uuid',
      alias: 'from_location_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
      format: 'text',
    },
    {
      header: '위치',
      name: 'location_nm',
      width: ENUM_WIDTH.L,
      format: 'text',
      noSave: true,
    },
  ];

  //#endregion
  //재고 선택 => 투입(행추가)
  if (props.visible) {
    return (
      <CustomModal
        title="투입품목등록"
        visible={true}
        width="80%"
        onCancel={() => props.setVisible(false)}
        onOk={() => {
          onDefaultGridSave(
            'basic',
            gridRefWorkInput,
            INPUT_GRID_ITEMS,
            URI_PATH_SAVE_INPUT,
            {
              work_uuid: props.searchParams.workUuid,
              c_usage: inputRefStandardInput?.current?.values?.c_usage,
              prod_uuid: inputRefStandardInput?.current?.values?.prod_uuid,
              unit_uuid: inputRefStandardInput?.current?.values?.unit_uuid,
              bom_input_type_uuid:
                inputRefStandardInput?.current?.values?.bom_input_type_uuid,
            },
            modal,
            () => {
              props.setVisible(false);
            },
          );
        }}
      >
        <InputGroupbox
          title={'투입'}
          id={'INSP_INPUT_ITEM'}
          inputItems={INPUT_ITEMS}
          innerRef={inputRefStandardInput}
          initialValues={{ ...rowData, reg_date: props.searchParams.regDate }}
          boxShadow={false}
        />
        <Datagrid
          gridId="투입품목등록_팝업_그리드"
          gridMode="create"
          ref={gridRefWorkInput}
          columns={INPUT_GRID_ITEMS}
          data={[]}
          disabledAutoDateColumn={true}
          rowAddPopupInfo={{
            columnNames: [
              { original: 'prod_uuid', popup: 'prod_uuid' },
              { original: 'item_type_nm', popup: 'item_type_nm' },
              { original: 'prod_type_nm', popup: 'prod_type_nm' },
              { original: 'prod_no', popup: 'prod_no' },
              { original: 'prod_nm', popup: 'prod_nm' },
              { original: 'model_nm', popup: 'model_nm' },
              { original: 'rev', popup: 'rev' },
              { original: 'prod_std', popup: 'prod_std' },
              { original: 'unit_nm', popup: 'unit_nm' },
              { original: 'store_uuid', popup: 'store_uuid' },
              { original: 'store_nm', popup: 'store_nm' },
              { original: 'location_uuid', popup: 'location_uuid' },
              { original: 'location_nm', popup: 'location_nm' },
              { original: 'lot_no', popup: 'lot_no' },
              { original: 'stock_qty', popup: 'qty' },
              { original: 'qty', popup: 'qty' },
            ],
            columns: [
              {
                header: '품목UUID',
                name: 'prod_uuid',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '품목유형UUID',
                name: 'item_type_uuid',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '품목유형',
                name: 'item_type_nm',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: '제품유형UUID',
                name: 'prod_type_uuid',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '제품유형',
                name: 'prod_type_nm',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: '품번',
                name: 'prod_no',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '품명',
                name: 'prod_nm',
                width: ENUM_WIDTH.L,
                format: 'text',
                filter: 'text',
              },
              {
                header: '모델',
                name: 'model_nm',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: 'Rev',
                name: 'rev',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: '규격',
                name: 'prod_std',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '단위',
                name: 'unit_nm',
                width: ENUM_WIDTH.S,
                format: 'text',
                filter: 'text',
              },
              {
                header: '창고UUID',
                name: 'store_uuid',
                width: ENUM_WIDTH.L,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '창고',
                name: 'store_nm',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: '위치UUID',
                name: 'location_uuid',
                width: ENUM_WIDTH.L,
                format: 'text',
                filter: 'text',
                hidden: true,
              },
              {
                header: '위치',
                name: 'location_nm',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: 'LOT NO',
                name: 'lot_no',
                width: ENUM_WIDTH.M,
                format: 'text',
                filter: 'text',
              },
              {
                header: '재고',
                name: 'qty',
                width: ENUM_WIDTH.M,
                format: 'number',
                filter: 'number',
                decimal: ENUM_DECIMAL.DEC_STCOK,
              },
            ],
            dataApiSettings: {
              uriPath: getPopupForm('재고관리')?.uriPath,
              params: {
                stock_type: 'available',
                grouped_type: 'all',
                price_type: 'all',
                exclude_zero_fg: true,
                exclude_minus_fg: true,
                reg_date: props.searchParams.regDate,
                store_uuid: rowData?.from_store_uuid,
                location_uuid: rowData?.from_location_uuid,
                prod_uuid: rowData?.prod_uuid,
              },
            },
            gridMode: 'multi-select',
          }}
        />
        {contextHolder}
      </CustomModal>
    );
  } else return null;
};
